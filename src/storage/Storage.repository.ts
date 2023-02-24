import { Injectable } from '@nestjs/common';
import { IDataStoreType } from './Types/IDataStoreType';

@Injectable()
export class StorageRepository {
    constructor(private data_store: IDataStoreType[]) {}

    createUser(userId: string) {
        this.data_store.push({ userId, collectedPosts: [] });
    }

    findUserData(userId: string): IDataStoreType {
        const user: IDataStoreType = this.data_store.find(
            (user: IDataStoreType) => user.userId === userId,
        );
        if (!user) {
            console.error("can't find user");
            return;
        }
        return user;
    }

    updateUserSession(oldId: string, newId: string): IDataStoreType {
        this.data_store = this.data_store.map((user: IDataStoreType) => {
            if (user.userId === oldId) {
                user.userId = newId;
                user.collectedPosts.length = 0;
            }
            return user;
        });
        const newUser = this.findUserData(newId);
        if (!newUser) {
            console.error("Can't find new user, update user id data error");
            return;
        }
        return newUser;
    }

    updateCollectedPosts({
        userId,
        collectedPosts,
    }: IDataStoreType): string[] {
        const postsIds: string[] = [];
        this.data_store = this.data_store.map((user: IDataStoreType) => {
            if (user.userId === userId) {
                user.collectedPosts = [...user.collectedPosts, ...collectedPosts].filter(
                    (el) => {
                      if (el && postsIds.includes(el)) {
                        return false;
                      } else {
                        el && postsIds.push(el);
                        return true;
                      }
                    }
                  );
            }
            return user;
        });
        return postsIds;
    }

    deleteUser(userId: string) {
        this.data_store = this.data_store.filter(
            (user: IDataStoreType) => user.userId !== userId,
        );
    }
}
