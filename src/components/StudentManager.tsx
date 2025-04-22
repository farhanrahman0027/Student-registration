import React, { useState } from 'react';
import { ArrowDownUp, Users } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import { useApp } from '../context/AppContext';

const StudentManager: React.FC = () => {
  const { 
    courseTypes, 
    courseOfferings, 
    getCourseOfferingsByCourseType, 
    getCourseTypeById,
    getCourseById,
    students,
    getFullCourseOfferingName
  } = useApp();

  const [selectedCourseTypeId, setSelectedCourseTypeId] = useState<string>('');
  const [isShowingAllOfferings, setIsShowingAllOfferings] = useState(true);

  const filteredOfferings = selectedCourseTypeId
    ? getCourseOfferingsByCourseType(selectedCourseTypeId)
    : courseOfferings;

  const totalStudents = students.length;
  
  const toggleFilter = () => {
    setIsShowingAllOfferings(!isShowingAllOfferings);
    setSelectedCourseTypeId('');
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Registrations</h2>
        <Button 
          variant="secondary"
          onClick={toggleFilter}
          className="flex items-center gap-2"
        >
          <ArrowDownUp size={16} />
          {isShowingAllOfferings ? 'Filter by Course Type' : 'Show All Offerings'}
        </Button>
      </div>

      {/* Stats card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-indigo-50 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800">Total Students</p>
              <p className="text-2xl font-bold text-indigo-900">{totalStudents}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-indigo-50 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800">Course Types</p>
              <p className="text-2xl font-bold text-indigo-900">{courseTypes.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Card>
        
        <Card className="bg-indigo-50 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800">Course Offerings</p>
              <p className="text-2xl font-bold text-indigo-900">{courseOfferings.length}</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {!isShowingAllOfferings && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Course Type
          </label>
          <select
            value={selectedCourseTypeId}
            onChange={(e) => setSelectedCourseTypeId(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a course type</option>
            {courseTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      )}

      {courseOfferings.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No course offerings available. Create course offerings to register students.</p>
          </div>
        </Card>
      ) : filteredOfferings.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No course offerings found for the selected course type.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOfferings.map(offering => {
            const courseType = getCourseTypeById(offering.courseTypeId);
            const course = getCourseById(offering.courseId);
            const registeredStudents = students.filter(s => s.courseOfferingId === offering.id);
            
            if (!courseType || !course) return null;
            
            return (
              <Card key={offering.id} className="overflow-visible">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    {courseType.name} - {course.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {registeredStudents.length} {registeredStudents.length === 1 ? 'student' : 'students'} registered
                  </p>
                </div>
                
                {registeredStudents.length === 0 ? (
                  <div className="text-center py-6 border rounded-md">
                    <p className="text-gray-500">No students registered for this course offering yet.</p>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {registeredStudents.map(student => (
                          <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.email}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentManager;