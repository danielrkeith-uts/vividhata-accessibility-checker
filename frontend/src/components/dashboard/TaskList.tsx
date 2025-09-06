import React, { useState } from 'react';
import './TaskList.css';
import { Checkbox, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Task {
  id: string;
  description: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'To Do';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#10b981';
      case 'In Progress':
        return '#f59e0b';
      case 'To Do':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              status: !task.completed ? 'Completed' : 'To Do',
            }
          : task
      )
    );
  };

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTaskList(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, status: newStatus, completed: newStatus === 'Completed' }
          : task
      )
    );
  };

  const filteredTasks = taskList.filter(task => {
    const categoryMatch = activeFilter === 'All' || task.category === activeFilter;
    const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
    return categoryMatch && priorityMatch;
  });

  const getCategoryCount = (category: string) => {
    if (category === 'All') return tasks.length;
    return tasks.filter(task => task.category === category).length;
  };

  const categories = ['All', 'Perceivable', 'Operable', 'Understandable', 'Robust'];

  return (
    <div className="task-list">
      <div className="task-header">
        <h3>Today's Tasks</h3>
        <div className="task-filters">
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category}
                className={`category-tab ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category} ({getCategoryCount(category)})
              </button>
            ))}
          </div>

          <FormControl size="small" sx={{ minWidth: 120, marginTop: '8px' }}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={priorityFilter}
              label="Priority"
              onChange={(e) => setPriorityFilter(e.target.value)}
              sx={{textAlign: 'left'}}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="task-content">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-checkbox">
              <Checkbox
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  color: getStatusColor(task.status),
                  '&.Mui-checked': {
                    color: getStatusColor(task.status),
                  },
                }}
              />
            </div>
            <div className="task-details">
              <div className="task-description">{task.description}</div>
              <div className="task-meta">
                <span className="task-category">{task.category}</span>
                <span className="task-priority" style={{ color: getPriorityColor(task.priority) }}>
                  {task.priority}
                </span>
              </div>
            </div>
            <div className="task-status">
              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel id={`status-label-${task.id}`}></InputLabel>
                <Select
                  labelId={`status-label-${task.id}`}
                  value={task.status}
                  size='small'
                  onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                  sx={{
                    backgroundColor: getStatusColor(task.status),
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: 500,
                    '& .MuiSelect-icon': {
                      color: 'white',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                  }}
                >
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="no-tasks">
            <p>No tasks found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
