import { MongoObservable } from 'meteor-rxjs';
import { StudentData } from '../server/models';

export const StudentsData = new MongoObservable.Collection<StudentData>('studentsData');

