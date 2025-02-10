import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({ name: '', year: '', type: '' });
    const [editVehicle, setEditVehicle] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const response = await axios.get('http://localhost:5000/vehicles');
        setVehicles(response.data);
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/vehicles', newVehicle);
        setNewVehicle({ name: '', year: '', type: '' });
        fetchVehicles();
    };

    const handleEditVehicle = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:5000/vehicles/${editVehicle.id}`, editVehicle);
        setEditVehicle(null);
        fetchVehicles();
    };

    const handleDeleteVehicle = async (id) => {
        await axios.delete(`http://localhost:5000/vehicles/${id}`);
        fetchVehicles();
    };

    const handleEditClick = (vehicle) => {
        setEditVehicle(vehicle);
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <h2>Vehiculos</h2>
            <form onSubmit={editVehicle ? handleEditVehicle : handleAddVehicle}>
                <input
                    type="text"
                    value={editVehicle ? editVehicle.name : newVehicle.name}
                    onChange={(e) => editVehicle ? setEditVehicle({ ...editVehicle, name: e.target.value }) : setNewVehicle({ ...newVehicle, name: e.target.value })}
                    placeholder="Nombre vehiculo"
                    required
                />
                <input
                    type="number"
                    value={editVehicle ? editVehicle.year : newVehicle.year}
                    onChange={(e) => editVehicle ? setEditVehicle({ ...editVehicle, year: e.target.value }) : setNewVehicle({ ...newVehicle, year: e.target.value })}
                    placeholder="Año"
                    required
                />
                <select
                    value={editVehicle ? editVehicle.type : newVehicle.type}
                    onChange={(e) => editVehicle ? setEditVehicle({ ...editVehicle, type: e.target.value }) : setNewVehicle({ ...newVehicle, type: e.target.value })}
                    required
                >
                    <option value="">Selecciona el tipo</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                </select>
                <button type="submit">{editVehicle ? 'Editar Vehiculo' : 'Agregar vehiculo'}</button>
            </form>
            <ul>
                {vehicles.map(vehicle => (
                    <li key={vehicle.id}>
                        {vehicle.name} ({vehicle.year}) - {vehicle.type}
                        <img src={`http://localhost:5000${vehicle.image}`} alt={vehicle.type} width="50" />
                        <button onClick={() => handleEditClick(vehicle)}>Editar</button>
                        <button onClick={() => handleDeleteVehicle(vehicle.id)}>Borrar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;