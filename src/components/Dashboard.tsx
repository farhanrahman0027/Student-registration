import React from 'react';
import { GraduationCap, BookOpen, Layers, Users } from 'lucide-react';
import Card from './ui/Card';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { courseTypes, courses, courseOfferings, students } = useApp();

  const stats = [
    {
      name: 'Course Types',
      value: courseTypes.length,
      icon: <Layers className="h-6 w-6 text-indigo-600" />,
      description: 'Total course types available',
    },
    {
      name: 'Courses',
      value: courses.length,
      icon: <BookOpen className="h-6 w-6 text-green-600" />,
      description: 'Total courses available',
    },
    {
      name: 'Course Offerings',
      value: courseOfferings.length,
      icon: <GraduationCap className="h-6 w-6 text-orange-600" />,
      description: 'Total course offerings',
    },
    {
      name: 'Students',
      value: students.length,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      description: 'Total registered students',
    },
  ];

  // Calculate most popular course offering
  const courseOfferingCounts = courseOfferings.map(offering => {
    const studentCount = students.filter(s => s.courseOfferingId === offering.id).length;
    return { offeringId: offering.id, count: studentCount };
  });

  const mostPopularOfferingData = courseOfferingCounts.sort((a, b) => b.count - a.count)[0];
  
  const mostPopularOffering = mostPopularOfferingData
    ? {
        offering: courseOfferings.find(o => o.id === mostPopularOfferingData.offeringId),
        count: mostPopularOfferingData.count
      }
    : null;

  return (
    <div className="space-y-6 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="">
            <div className="">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-gray-50">
                  {stat.icon}
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">{stat.description}</p>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Welcome</h3>
            <p className="opacity-80">
              Efficiently manage your educational institution with our comprehensive
              student registration system. Create course types, manage courses, and
              track student registrations all in one place.
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="text-sm opacity-80">Course Types</p>
                <p className="text-2xl font-bold">{courseTypes.length}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <p className="text-sm opacity-80">Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Registration Statistics</h3>
            
            {courseOfferings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No course offerings available yet.</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No students registered yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Students per Course Type:</p>
                  <div className="mt-2 space-y-2">
                    {courseTypes.map(type => {
                      const typeOfferings = courseOfferings.filter(o => o.courseTypeId === type.id);
                      const typeStudentCount = students.filter(s => 
                        typeOfferings.some(o => o.id === s.courseOfferingId)
                      ).length;
                      
                      return (
                        <div key={type.id} className="flex items-center">
                          <span className="text-sm text-gray-700 w-1/3">{type.name}</span>
                          <div className="w-2/3 h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-600 rounded-full"
                              style={{ width: `${students.length ? (typeStudentCount / students.length) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-600">{typeStudentCount}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {mostPopularOffering && mostPopularOffering.offering && mostPopularOffering.count > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Most Popular Course Offering:</p>
                    <p className="font-medium text-gray-800">
                      {(() => {
                        const offering = mostPopularOffering.offering;
                        if (!offering) return 'Unknown';
                        
                        const course = courses.find(c => c.id === offering.courseId);
                        const courseType = courseTypes.find(ct => ct.id === offering.courseTypeId);
                        
                        return `${courseType?.name || "Unknown"} - ${course?.name || "Unknown"}`;
                      })()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mostPopularOffering.count} {mostPopularOffering.count === 1 ? 'student' : 'students'} registered
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;