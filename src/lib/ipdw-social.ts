import {Buffer} from "buffer";

class IpdwSocialProfile {
    public name!: Buffer;
    public posts!: string[];
    public sig?: Buffer;
}

export class IPDWSocial {

    public async getProfile(profileId: string): Promise<IpdwSocialProfile> {
        return new IpdwSocialProfile();
    }

    public async setProfile(profile: IpdwSocialProfile): Promise<void> {

    }


}
