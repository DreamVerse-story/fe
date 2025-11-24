/**
 * User Repository - MongoDB CRUD 작업
 */

import { getDatabase, COLLECTIONS } from '../mongodb';
import type { UserDocument } from '../models';

/**
 * User 컬렉션 가져오기
 */
async function getUsersCollection() {
    const db = await getDatabase();
    return db.collection<UserDocument>(COLLECTIONS.USERS);
}

/**
 * 사용자 생성 또는 조회
 */
export async function findOrCreateUser(userId: string): Promise<UserDocument> {
    const collection = await getUsersCollection();

    const existingUser = await collection.findOne({ userId });
    if (existingUser) {
        return existingUser;
    }

    const newUser: Omit<UserDocument, '_id'> = {
        userId,
        preferences: {
            language: 'ko',
            notifications: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await collection.insertOne(newUser as UserDocument);
    return newUser as UserDocument;
}

/**
 * 사용자 정보 조회 (ID)
 */
export async function getUserById(userId: string): Promise<UserDocument | null> {
    const collection = await getUsersCollection();
    return collection.findOne({ userId });
}

/**
 * 사용자 정보 조회 (지갑 주소)
 */
export async function getUserByWallet(walletAddress: string): Promise<UserDocument | null> {
    const collection = await getUsersCollection();
    return collection.findOne({ walletAddress });
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUser(
    userId: string,
    updates: Partial<Omit<UserDocument, '_id' | 'userId' | 'createdAt'>>
): Promise<void> {
    const collection = await getUsersCollection();
    await collection.updateOne(
        { userId },
        {
            $set: {
                ...updates,
                updatedAt: new Date(),
            },
        }
    );
}

/**
 * 지갑 주소 연결
 */
export async function connectWallet(userId: string, walletAddress: string): Promise<void> {
    await updateUser(userId, { walletAddress });
}

/**
 * 사용자 삭제
 */
export async function deleteUser(userId: string): Promise<void> {
    const collection = await getUsersCollection();
    await collection.deleteOne({ userId });
}

