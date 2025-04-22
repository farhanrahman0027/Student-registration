import React, { useState } from 'react';
import { Edit, Trash, Plus } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { useApp } from '../context/AppContext';

const CourseTypeManager: React.FC = () => {
  const { courseTypes, addCourseType, updateCourseType, deleteCourseType } = useApp();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [newCourseName, setNewCourseName] = useState('');
  const [editCourseName, setEditCourseName] = useState('');
  const [currentCourseType, setCurrentCourseType] = useState<string | null>(null);
  
  const [error, setError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCourseName.trim()) {
      setError('Course type name is required');
      return;
    }
    
    addCourseType(newCourseName);
    setNewCourseName('');
    setIsAddModalOpen(false);
    setError('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCourseName.trim()) {
      setError('Course type name is required');
      return;
    }
    
    if (currentCourseType) {
      updateCourseType(currentCourseType, editCourseName);
      setIsEditModalOpen(false);
      setError('');
    }
  };

  const handleDeleteSubmit = () => {
    if (currentCourseType) {
      deleteCourseType(currentCourseType);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (id: string, name: string) => {
    setCurrentCourseType(id);
    setEditCourseName(name);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (id: string) => {
    setCurrentCourseType(id);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <div className="flex justify-between items-center w-full">
        <h2 className="text-2xl font-bold text-gray-800">Course Types</h2>
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

      {courseTypes.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No course types yet. Add your first course type!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courseTypes.map(courseType => (
            <Card key={courseType.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-700">{courseType.name}</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditModal(courseType.id, courseType.name)}
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(courseType.id)}
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
        title="Add Course Type"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Course Type Name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            error={error}
            placeholder="e.g. Individual, Group, Special"
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
            <Button type="submit">Add Course Type</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Course Type"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Course Type Name"
            value={editCourseName}
            onChange={(e) => setEditCourseName(e.target.value)}
            error={error}
            autoFocus
          />
          <div className="flex justify-end gap-4">
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
        title="Delete Course Type"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this course type? This action cannot be undone.
          </p>
          <p className="text-sm text-red-600">
            Note: Deleting this course type will also delete any associated course offerings.
          </p>
          <div className="flex justify-end gap-4">
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

export default CourseTypeManager;