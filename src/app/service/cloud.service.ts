import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Table } from '@enum/table.enum';
import * as firebase from 'firebase';

@Injectable({
	providedIn: 'root',
})
export class CloudService {
	constructor(protected firestore: AngularFirestore) {}

	createData(primaryKey, data: {}, table: string): Promise<{}> {
		return this.firestore
			.collection(table)
			.add(data)
			.then(docRef => ({ ...data, [primaryKey]: docRef.id }));
	}

	setDocDataByID(id, data, table): Promise<void> {
		return this.firestore.collection(table).doc(id).set(data, { merge: true });
	}

	getDataById(id: string, table: string): Observable<any> {
		return this.firestore.collection(table).doc(id).valueChanges();
	}

	getDocumentData(id: string, table: Table) {
		return this.firestore.collection(table).doc(id).get();
	}

	getAllData(table: string): Observable<any> {
		return this.firestore.collection(table).valueChanges();
	}

	updateData(dataID: string, data: {}, table: string): Promise<void> {
		return this.firestore.doc(`${table}/${dataID}`).update(data);
	}

	deleteData(dataID: string, table: string): Promise<void> {
		return this.firestore.doc(`${table}/${dataID}`).delete();
	}

	deleteArrayItem(item: {}) {
		return firebase.firestore.FieldValue.arrayRemove(item);
	}

	addArrayItem(item: {}) {
		return firebase.firestore.FieldValue.arrayUnion(item);
	}
}
