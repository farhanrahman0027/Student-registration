import React from 'react';
import Card from './ui/Card';
import { useApp } from '../context/AppContext';

interface StudentListProps {
  courseOfferingId: string;
}

const StudentList: React.FC<StudentListProps> = ({ courseOfferingId }) => {
  const { getStudentsByCourseOffering, getFullCourseOfferingName } = useApp();
  
  const students = getStudentsByCourseOffering(courseOfferingId);
  const courseOfferingName = getFullCourseOfferingName(courseOfferingId);

  return (
    <div className="space-y-4 min-h-screen">
      <h3 className="text-lg font-medium text-gray-800">
        {courseOfferingName}
      </h3>
      
      {students.length === 0 ? (
        <div className="text-center py-6">
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
              {students.map((student) => (
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
    </div>
  );
};

export default StudentList;