import { MongoObservable } from 'meteor-rxjs';
import {Course, CourseSubject} from '../../server/models';

export const Courses = new MongoObservable.Collection<Course>('courses');
export const CourseSubjects = new MongoObservable.Collection<CourseSubject>('course_subjects');
