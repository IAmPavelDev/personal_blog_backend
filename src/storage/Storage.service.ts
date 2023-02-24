import { Injectable } from '@nestjs/common';
import { StorageRepository } from './Storage.repository';

@Injectable()
export class StorageService {
    constructor(private readonly Store: StorageRepository) {}

    create(userId: string) {
        this.Store.createUser(userId);
        return this.get(userId);
    }

    get(userId: string) {
        return this.Store.findUserData(userId);
    }

    updateUserSession(oldId: string, newId: string) {
        return this.Store.updateUserSession(oldId, newId);
    }

    updateCollected(userId: string, collectedPosts: string[]) {
        const updated = this.Store.updateCollectedPosts({
            userId,
            collectedPosts,
        });
        if (!updated) {
            console.error("can't update collected posts collection");
        }
    }

    delete(userId: string) {
        this.Store.deleteUser(userId);
    }
}
