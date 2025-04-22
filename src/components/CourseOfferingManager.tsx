import React, { useState } from 'react';
import { Edit, Trash, Plus, UserPlus } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';
import StudentList from './StudentList';

const CourseOfferingManager: React.FC = () => {
  const { 
    courseOfferings, 
    courses, 
    courseTypes, 
    addCourseOffering, 
    updateCourseOffering, 
    deleteCourseOffering,
    getCourseById,
    getCourseTypeById,
    getStudentsByCourseOffering,
    addStudent
  } = useApp();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTypeId, setSelectedCourseTypeId] = useState('');
  const [currentOffering, setCurrentOffering] = useState<string | null>(null);
  
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  
  const [error, setError] = useState('');
  const [studentError, setStudentError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      setError('Please select a course');
      return;
    }
    
    if (!selectedCourseTypeId) {
      setError('Please select a course type');
      return;
    }
    
    addCourseOffering(selectedCourseId, selectedCourseTypeId);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId) {
      setError('Please select a course');
      return;
    }
    
    if (!selectedCourseTypeId) {
      setError('Please select a course type');
      return;
    }
    
    if (currentOffering) {
      updateCourseOffering(currentOffering, selectedCourseId, selectedCourseTypeId);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteSubmit = () => {
    if (currentOffering) {
      deleteCourseOffering(currentOffering);
      setIsDeleteModalOpen(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim()) {
      setStudentError('Student name is required');
      return;
    }
    
    if (!studentEmail.trim()) {
      setStudentError('Student email is required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
      setStudentError('Please enter a valid email address');
      return;
    }
    
    if (currentOffering) {
      addStudent(studentName, studentEmail, currentOffering);
      setStudentName('');
      setStudentEmail('');
      setIsRegisterModalOpen(false);
      setStudentError('');
    }
  };

  const openEditModal = (offering: typeof courseOfferings[0]) => {
    setCurrentOffering(offering.id);
    setSelectedCourseId(offering.courseId);
    setSelectedCourseTypeId(offering.courseTypeId);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setCurrentOffering(id);
    setIsDeleteModalOpen(true);
  };

  const openStudentModal = (id: string) => {
    setCurrentOffering(id);
    setIsStudentModalOpen(true);
  };

  const openRegisterModal = (id: string) => {
    setCurrentOffering(id);
    setStudentName('');
    setStudentEmail('');
    setStudentError('');
    setIsRegisterModalOpen(true);
  };

  const resetForm = () => {
    setSelectedCourseId('');
    setSelectedCourseTypeId('');
    setError('');
  };

  return (
    <div className="space-y-6 min-h-screen" >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Course Offerings</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2"
          disabled={courses.length === 0 || courseTypes.length === 0}
        >
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {courses.length === 0 || courseTypes.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {courses.length === 0 && courseTypes.length === 0 ? (
                "You need to create courses and course types before adding course offerings."
              ) : courses.length === 0 ? (
                "You need to create courses before adding course offerings."
              ) : (
                "You need to create course types before adding course offerings."
              )}
            </p>
          </div>
        </Card>
      ) : courseOfferings.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No course offerings yet. Add your first offering!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseOfferings.map(offering => {
            const course = getCourseById(offering.courseId);
            const courseType = getCourseTypeById(offering.courseTypeId);
            const studentCount = getStudentsByCourseOffering(offering.id).length;
            
            return (
              <Card key={offering.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        {courseType?.name} - {course?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {studentCount} {studentCount === 1 ? 'student' : 'students'} registered
                      </p>
                    </div>
                    <div className="flex space-x-2 items-start mt-2">
                      <button
                        onClick={() => openEditModal(offering)}
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(offering.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => openStudentModal(offering.id)}
                      variant="secondary"
                    >
                      View Students
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => openRegisterModal(offering.id)}
                      className="flex items-center gap-1"
                    >
                      <UserPlus size={14} />
                      Register
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Course Offering"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className={`block w-full px-3 py-2 border ${error && !selectedCourseId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              value={selectedCourseTypeId}
              onChange={(e) => setSelectedCourseTypeId(e.target.value)}
              className={`block w-full px-3 py-2 border ${error && !selectedCourseTypeId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a course type</option>
              {courseTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Course Offering</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course Offering"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className={`block w-full px-3 py-2 border ${error && !selectedCourseId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <select
              value={selectedCourseTypeId}
              onChange={(e) => setSelectedCourseTypeId(e.target.value)}
              className={`block w-full px-3 py-2 border ${error && !selectedCourseTypeId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a course type</option>
              {courseTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Course Offering"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this course offering? This action cannot be undone.
          </p>
          <p className="text-sm text-red-600">
            Note: Deleting this course offering will also remove all student registrations associated with it.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteSubmit}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Students Modal */}
      <Modal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        title="Registered Students"
      >
        {currentOffering && (
          <StudentList courseOfferingId={currentOffering} />
        )}
        <div className="flex justify-end mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsStudentModalOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>

      {/* Register Student Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Student"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <Input
            label="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            error={studentError && !studentName ? 'Student name is required' : ''}
            placeholder="Enter student name"
            autoFocus
          />
          
          <Input
            label="Student Email"
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            error={studentError && studentName ? studentError : ''}
            placeholder="Enter student email"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Register Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CourseOfferingManager;