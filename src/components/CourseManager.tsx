import React, { useState } from 'react';
import { Edit, Trash, Plus } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';

const CourseManager: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse } = useApp();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [newCourseName, setNewCourseName] = useState('');
  const [editCourseName, setEditCourseName] = useState('');
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);
  
  const [error, setError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCourseName.trim()) {
      setError('Course name is required');
      return;
    }
    
    addCourse(newCourseName);
    setNewCourseName('');
    setIsAddModalOpen(false);
    setError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCourseName.trim()) {
      setError('Course name is required');
      return;
    }
    
    if (currentCourse) {
      updateCourse(currentCourse, editCourseName);
      setIsEditModalOpen(false);
      setError('');
    }
  };

  const handleDeleteSubmit = () => {
    if (currentCourse) {
      deleteCourse(currentCourse);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (id: string, name: string) => {
    setCurrentCourse(id);
    setEditCourseName(name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setCurrentCourse(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Courses</h2>
        <Button 
          onClick={() => {
            setNewCourseName('');
            setError('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New
        </Button>
      </div>

      {courses.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No courses yet. Add your first course!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-700 ">{course.name}</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => openEditModal(course.id, course.name)}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(course.id)}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Course"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Course Name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            error={error}
            placeholder="e.g. English, Mathematics, Science"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Course Name"
            value={editCourseName}
            onChange={(e) => setEditCourseName(e.target.value)}
            error={error}
            autoFocus
          />
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
        title="Delete Course"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this course? This action cannot be undone.
          </p>
          <p className="text-sm text-red-600">
            Note: Deleting this course will also delete any associated course offerings.
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
    </div>
  );
};

export default CourseManager;