import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { CourseType, Course, CourseOffering, Student } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
  // Course Types
  courseTypes: CourseType[];
  addCourseType: (name: string) => void;
  updateCourseType: (id: string, name: string) => void;
  deleteCourseType: (id: string) => void;
  
  // Courses
  courses: Course[];
  addCourse: (name: string) => void;
  updateCourse: (id: string, name: string) => void;
  deleteCourse: (id: string) => void;
  
  // Course Offerings
  courseOfferings: CourseOffering[];
  addCourseOffering: (courseId: string, courseTypeId: string) => void;
  updateCourseOffering: (id: string, courseId: string, courseTypeId: string) => void;
  deleteCourseOffering: (id: string) => void;
  
  // Students
  students: Student[];
  addStudent: (name: string, email: string, courseOfferingId: string) => void;
  getStudentsByCourseOffering: (courseOfferingId: string) => Student[];
  
  // Helpers
  getCourseById: (id: string) => Course | undefined;
  getCourseTypeById: (id: string) => CourseType | undefined;
  getCourseOfferingById: (id: string) => CourseOffering | undefined;
  getFullCourseOfferingName: (courseOfferingId: string) => string;
  getCourseOfferingsByCourseType: (courseTypeId: string) => CourseOffering[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseTypes, setCourseTypes] = useLocalStorage<CourseType[]>('courseTypes', []);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
  const [courseOfferings, setCourseOfferings] = useLocalStorage<CourseOffering[]>('courseOfferings', []);
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);

  // Course Types
  const addCourseType = useCallback((name: string) => {
    setCourseTypes(prev => [...prev, { id: generateId(), name }]);
  }, [setCourseTypes]);

  const updateCourseType = useCallback((id: string, name: string) => {
    setCourseTypes(prev => 
      prev.map(courseType => courseType.id === id ? { ...courseType, name } : courseType)
    );
  }, [setCourseTypes]);

  const deleteCourseType = useCallback((id: string) => {
    setCourseTypes(prev => prev.filter(courseType => courseType.id !== id));
    
    // Also delete related course offerings
    setCourseOfferings(prev => 
      prev.filter(offering => offering.courseTypeId !== id)
    );
  }, [setCourseTypes, setCourseOfferings]);

  // Courses
  const addCourse = useCallback((name: string) => {
    setCourses(prev => [...prev, { id: generateId(), name }]);
  }, [setCourses]);

  const updateCourse = useCallback((id: string, name: string) => {
    setCourses(prev => 
      prev.map(course => course.id === id ? { ...course, name } : course)
    );
  }, [setCourses]);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    
    // Also delete related course offerings
    setCourseOfferings(prev => 
      prev.filter(offering => offering.courseId !== id)
    );
  }, [setCourses, setCourseOfferings]);

  // Course Offerings
  const addCourseOffering = useCallback((courseId: string, courseTypeId: string) => {
    setCourseOfferings(prev => [...prev, { id: generateId(), courseId, courseTypeId }]);
  }, [setCourseOfferings]);

  const updateCourseOffering = useCallback((id: string, courseId: string, courseTypeId: string) => {
    setCourseOfferings(prev => 
      prev.map(offering => offering.id === id ? { ...offering, courseId, courseTypeId } : offering)
    );
  }, [setCourseOfferings]);

  const deleteCourseOffering = useCallback((id: string) => {
    setCourseOfferings(prev => prev.filter(offering => offering.id !== id));
    
    // Also delete related student registrations
    setStudents(prev => 
      prev.filter(student => student.courseOfferingId !== id)
    );
  }, [setCourseOfferings, setStudents]);

  // Students
  const addStudent = useCallback((name: string, email: string, courseOfferingId: string) => {
    setStudents(prev => [...prev, { id: generateId(), name, email, courseOfferingId }]);
  }, [setStudents]);

  const getStudentsByCourseOffering = useCallback((courseOfferingId: string) => {
    return students.filter(student => student.courseOfferingId === courseOfferingId);
  }, [students]);

  // Helper functions
  const getCourseById = useCallback((id: string) => {
    return courses.find(course => course.id === id);
  }, [courses]);

  const getCourseTypeById = useCallback((id: string) => {
    return courseTypes.find(courseType => courseType.id === id);
  }, [courseTypes]);

  const getCourseOfferingById = useCallback((id: string) => {
    return courseOfferings.find(offering => offering.id === id);
  }, [courseOfferings]);

  const getFullCourseOfferingName = useCallback((courseOfferingId: string) => {
    const offering = courseOfferings.find(o => o.id === courseOfferingId);
    if (!offering) return "Unknown";
    
    const course = courses.find(c => c.id === offering.courseId);
    const courseType = courseTypes.find(ct => ct.id === offering.courseTypeId);
    
    return `${courseType?.name || "Unknown"} - ${course?.name || "Unknown"}`;
  }, [courseOfferings, courses, courseTypes]);

  const getCourseOfferingsByCourseType = useCallback((courseTypeId: string) => {
    return courseOfferings.filter(offering => offering.courseTypeId === courseTypeId);
  }, [courseOfferings]);

  const value = {
    courseTypes,
    addCourseType,
    updateCourseType,
    deleteCourseType,
    
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    
    courseOfferings,
    addCourseOffering,
    updateCourseOffering,
    deleteCourseOffering,
    
    students,
    addStudent,
    getStudentsByCourseOffering,
    
    getCourseById,
    getCourseTypeById,
    getCourseOfferingById,
    getFullCourseOfferingName,
    getCourseOfferingsByCourseType,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};