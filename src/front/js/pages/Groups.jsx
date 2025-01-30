import React, { useEffect, useState } from 'react';

export function Groups() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [group, setGroup] = useState(() => {
    const savedGroup = localStorage.getItem('group');
    return savedGroup ? JSON.parse(savedGroup) : null;
  });
  const [nameGroup, setNameGroup] = useState(group ? group.name : '');
  const [finances, setFinances] = useState([]);
  const [selectedFinance, setSelectedFinance] = useState('');

  useEffect(() => {
    if (!group && user.id_group) {
      getGroup();
    } else if (group) {
      setMessage(`Ya perteneces a un grupo: ${group.name}`);
    } else {
      setMessage('No perteneces a ningún grupo, puedes crear uno nuevo.');
    }
  }, [user, group]);

  useEffect(() => {
    if (user && group) {
      fetchFinances(); // Llamar a la función fetchFinances cuando el usuario y grupo estén definidos
    }
  }, [user, group]);

  // Obtener el Grupo del usuario
  const getGroup = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/get_user_group/${user.id}`);
      const updatedGroup = await response.json();
      if (response.status === 200) {
        setGroup(updatedGroup);
        localStorage.setItem('group', JSON.stringify(updatedGroup));
      }
    } catch (error) {
      console.log('Error al cargar el grupo', error);
    }
  };

  // Añadir usuario al grupo
  const addUserToGroup = async ({ id_group }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/add_user_to_group/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_group }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          id_group,
        }));
        await changeRol({ id_rol: 1 });
      }
    } catch (error) {
      console.log('Error al añadir usuario al grupo', error);
    }
  };

  // Crear grupo
  const createGroup = async ({ name, description }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/create_groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('group', JSON.stringify(data));
        setGroup(data);
        await addUserToGroup({ id_group: data.id });
        location.reload();
      }
    } catch (error) {
      console.log('Error al crear grupo', error);
    }
  };

  // Cambiar rol del usuario
  const changeRol = async ({ id_rol }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/change_rol/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_rol }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser,
          id_rol,
        }));
        localStorage.setItem('user', JSON.stringify({ ...user, id_rol }));
      }
    } catch (error) {
      console.log('Error al cambiar rol', error);
    }
  };

  // Borrar grupo
  const deleteGroup = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/delete_group/${group.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_group: group.id }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.removeItem('group');
        setGroup(null);
        await changeRol({ id_rol: 2 });
        setInterval(() => {
          location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log('Error al eliminar grupo', error);
    }
  };

  // Cambiar nombre del grupo
  const renameGroup = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/rename_group/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameGroup }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setGroup((prevGroup) => ({
          ...prevGroup,
          name: nameGroup,
        }));
        location.reload();
        await getGroup();
      }
    } catch (error) {
      console.log('Error al cambiar nombre de grupo', error);
    }
  };

  // Obtener finanzas
  const fetchFinances = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/get_finances/${user.id}`);
      const data = await response.json();
      console.log(data); // Verifica los datos recibidos del backend


      if (response.status === 200) {
        setFinances(data);
      }
    } catch (error) {
      console.error('Error al obtener las finanzas:', error);
    }
  };

 // Añadir finanza al grupo
 const addGroupFinance = async () => {
  try {
    // Verificar si los datos existen antes de enviarlos
    if (!group?.id || !selectedFinance || !user?.id) {
      console.error("Faltan datos obligatorios:", { group, selectedFinance, user });
      setMessage("Error: Faltan datos obligatorios.");
      return;
    }

    // Imprimir los valores antes de enviarlos
    console.log("group.id:", group.id);
    console.log("selectedFinance:", selectedFinance);
    console.log("user.id:", user.id);

    const requestData = {
      id_group: group.id,
      id_finance: selectedFinance,
      id_user: user.id,
      date: new Date().toISOString().split("T")[0], 
    };

    console.log("Datos enviados a backend:", requestData); // Depuración(imprime los datos enviados en el frontend y recibidos en el backend.)

    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/add_group_finance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      setMessage("Finanza añadida correctamente al grupo.");
      console.log("Finanza añadida correctamente:", responseData);
      fetchFinances(); // Recargar la lista de finanzas
    } else {
      setMessage(`Error: ${responseData.error || "No se pudo añadir la finanza."}`);
      console.error("Error en la respuesta del backend:", responseData);
    }
  } catch (error) {
    setMessage("Error al añadir finanza al grupo.");
    console.error("Error en fetch:", error);
  }
};

  return (
    <div>
      <div className="alert alert-warning" role="alert">
        {message}
      </div>
      {!group && (
        <div>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createGroup">
            Create Group
          </button>
          {/* Modal para crear grupo */}
          <div className="modal fade" id="createGroup" aria-labelledby="createGroupLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="createGroupLabel">New Group</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createGroup({ name, description });
                  }}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name for Group</label>
                      <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea className="form-control" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="submit" className="btn btn-primary">Create Group</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {user?.id_rol === 1 && group && (
        <div>
          <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#renameGroup">
            Rename Group
          </button>

          <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#addFinanceModal">
            Add Finance
          </button>
          {/* Modal para añadir finanza */}
          <div className="modal fade" id="addFinanceModal" aria-labelledby="addFinanceModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addFinanceModalLabel">Añadir Finanza al Grupo</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    addGroupFinance();
                  }}>
                    <div className="mb-3">
                      <label htmlFor="selectFinance" className="form-label">Seleccionar Finanza</label>
                      <select
                        id="selectFinance"
                        className="form-select"
                        value={selectedFinance}
                        onChange={(e) => setSelectedFinance(e.target.value)}
                      >
                        <option value="">Selecciona una opción</option>
                        {finances.map((finance) => (
                          <option key={finance.id} value={finance.id}>
                            {finance.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                      <button type="submit" className="btn btn-primary">Añadir Finanza</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Modal para eliminar grupo */}
          <div className="modal fade" id="deleteGroup" aria-labelledby="deleteGroupLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="deleteGroupLabel">Seguro que deseas eliminar el grupo</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn btn-danger" onClick={deleteGroup}>Eliminar Grupo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
