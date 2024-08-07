import * as acme from 'acme-client';
import * as fs from 'fs';
import * as http from 'http';
import forge from 'node-forge';

const CERT_PATH = './data/cert.pem';
const KEY_PATH = './data/key.pem';

export interface CertificateInfo {
    key: string;
    cert: string;
    expirationDate: Date;
}

async function generateOrRenewCertificate(domain: string): Promise<CertificateInfo> {
    const client = new acme.Client({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey: await acme.forge.createPrivateKey()
    });

    const [key, csr] = await acme.forge.createCsr({
        commonName: domain,
    });

    let server: http.Server | null = null;
    let challengePath: string | null = null;
    let challengeContent: string | null = null;

    const cert = await client.auto({
        csr,
        email: `info@${domain}`,
        termsOfServiceAgreed: true,
        challengePriority: ['http-01'],
        challengeCreateFn: async (authz, challenge, keyAuthorization) => {
            if (challenge.type === 'http-01') {
                challengePath = `/.well-known/acme-challenge/${challenge.token}`;
                challengeContent = keyAuthorization;

                server = http.createServer((req, res) => {
                    if (req.url === challengePath) {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(challengeContent);
                    } else {
                        res.writeHead(404);
                        res.end();
                    }
                });

                await new Promise<void>((resolve) => {
                    server!.listen(80, () => {
                        console.log('ACME challenge server listening on port 80');
                        resolve();
                    });
                });
            }
        },
        challengeRemoveFn: async (authz, challenge, keyAuthorization) => {
            if (server) {
                await new Promise<void>((resolve) => {
                    server!.close(() => {
                        console.log('ACME challenge server closed');
                        resolve();
                    });
                });
                server = null;
            }
            challengePath = null;
            challengeContent = null;
        },
    });

    console.log('Certificate generated');

    const expirationDate = parseCertificateExpirationDate(cert)!;

    return {
        key: key.toString(),
        cert,
        expirationDate
    };
}

function parseCertificateExpirationDate(certPem: string): Date | null {
    try {
        const firstCertPem = certPem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/)![0];
        const certDer = forge.util.decode64(firstCertPem.replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|[\r\n]/g, ''));
        const certAsn1 = forge.asn1.fromDer(certDer);
        const cert = forge.pki.certificateFromAsn1(certAsn1);
        return cert.validity.notAfter;
    } catch (error) {
        console.error('Error parsing certificate:', error);
        return null;
    }
}

export async function ensureValidCertificate(domain: string): Promise<[CertificateInfo, boolean]> {
    let certInfo: CertificateInfo;
    let changed: boolean = false;

    if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
        const cert = fs.readFileSync(CERT_PATH, 'utf-8');
        const key = fs.readFileSync(KEY_PATH, 'utf-8');
        const expirationDate = parseCertificateExpirationDate(cert)!;

        certInfo = {cert, key, expirationDate};

        console.log('Loaded existing certificate');

        // If the certificate expires in less than 30 days, renew it
        if (expirationDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000) {
            console.log('Certificate expiring soon. Renewing...');
            certInfo = await generateOrRenewCertificate(domain);
            changed = true;
        }
    } else {
        console.log('No existing certificate found. Generating new one...');
        certInfo = await generateOrRenewCertificate(domain);
        changed = true;
    }

    // Save the certificate and key
    fs.writeFileSync(CERT_PATH, certInfo.cert);
    fs.writeFileSync(KEY_PATH, certInfo.key);

    return [certInfo, changed];
}
