import React, { useEffect, useState } from 'react';
import doctorsData from '../data/doctors.json';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TableItem {
  id: number;
  fullName: string;
  department: string;
  isHead: boolean;
}

const Table: React.FC<{ name: string, isDoctor: boolean }> = ({ name, isDoctor }) => {
  const [items, setItems] = useState<TableItem[]>(doctorsData);
  const [newItems, setNewItems] = useState<TableItem>({ id: 0, fullName: '', department: 'кардиологическое', isHead: false });
  const [editDoctorId, setEditDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const storedDoctors = localStorage.getItem(name);
    if (storedDoctors) {
      setNewItems(JSON.parse(storedDoctors));
    }
  }, []);

  const updateLocalStorage = (updatedDoctors: TableItem[]) => {
    localStorage.setItem(name, JSON.stringify(updatedDoctors));
  };

  const handleAddOrEditDoctor = () => {
    let updatedDoctors: TableItem[];
    if (editDoctorId !== null) {
      updatedDoctors = items.map(doctor => doctor.id === editDoctorId ? { ...newItems, id: editDoctorId } : doctor);
      setEditDoctorId(null);
    } else {
      updatedDoctors = [...items, { ...newItems, id: items.length + 1 }];
    }

    setItems(updatedDoctors);
    console.log(updatedDoctors);
    updateLocalStorage(updatedDoctors);

    // Reset newItems to its initial state
    setNewItems({ id: 0, fullName: '', department: 'кардиологическое', isHead: false });
  };

  const handleEdit = (doctor: TableItem) => {
    setNewItems(doctor);
    setEditDoctorId(doctor.id);
  };

  const handleDelete = (id: number) => {
    const updatedDoctors: TableItem[] = items.filter(doctor => doctor.id !== id);
    setItems(updatedDoctors);
    updateLocalStorage(updatedDoctors);
  };

  useEffect(() => {
    console.log(name, localStorage.getItem(name));
    setItems(JSON.parse(localStorage.getItem(name) || "[]"))
  }, [])

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Врачи</h2>
      <div className="mb-4">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="ФИО"
          value={newItems.fullName}
          onChange={(e) => setNewItems({ ...newItems, fullName: e.target.value })}
        />
        <select
          className="form-select mb-2"
          value={newItems.department}
          onChange={(e) => setNewItems({ ...newItems, department: e.target.value })}
        >
          <option value="кардиологическое">Кардиологическое</option>
          <option value="хирургическое">Хирургическое</option>
        </select>
        {isDoctor && (
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={newItems.isHead}
              onChange={(e) => setNewItems({ ...newItems, isHead: e.target.checked })}
            />
            <label className="form-check-label">Заведующий</label>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleAddOrEditDoctor}>
          {editDoctorId ? 'Сохранить' : 'Добавить'}
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Отделение</th>
            {isDoctor && <th>Заведующий</th>}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.fullName}</td>
              <td>{item.department}</td>
              {isDoctor && <td>{item.isHead ? 'Да' : 'Нет'}</td>}
              <td>
                <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Редактировать</button>
                <button className="btn btn-danger delete" onClick={() => handleDelete(item.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div >
  );
};

export default Table;