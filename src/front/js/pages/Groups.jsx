import React, { useEffect, useState } from 'react';

export function Groups() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
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
  const [selectedFinance, setSelectedFinance] = useState(null);

  useEffect(() => {
    if (!group && user?.id_group) {
      getGroup();
    } else if (group) {
      setMessage(`Ya perteneces a un grupo: ${group.name}`);
    } else {
      setMessage('No perteneces a ningún grupo, puedes crear uno nuevo.');
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
    if (!name || !description) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

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
    if (!nameGroup) {
      setMessage('El nombre del grupo no puede estar vacío.');
      return;
    }

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
      if (response.status === 200) {
        setFinances(data);
      }
    } catch (error) {
      console.error('Error al obtener las finanzas:', error);
    }
  };
  // Añadir finanza al grupo
  const addGroupFinance = async () => {
    if (!selectedFinance) {
      setMessage('Por favor, selecciona una finanza.');
      return;
    }

    try {
      const financeExists = group.finances?.some(finance => finance.id === selectedFinance);
      if (financeExists) {
        setMessage('Esta finanza ya ha sido añadida al grupo.');
        return;
      }

      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/add_group_finance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_group: group.id,
          id_finance: selectedFinance,
          id_user: user.id,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.status === 200) {
        const addedFinance = finances.find(f => f.id === selectedFinance);
        setGroup(prevGroup => ({
          ...prevGroup,
          finances: [...(prevGroup.finances || []), addedFinance],
        }));
        setMessage('Finanza añadida correctamente al grupo.');
        setSelectedFinance(null);
        document.getElementById('addFinanceModal').querySelector('.btn-close').click();
      } else {
        const errorData = await response.json();
        setMessage('Error al añadir finanza al grupo.');
        console.error('Error al añadir finanza al grupo:', errorData);
      }
    } catch (error) {
      setMessage('Error al añadir finanza al grupo.');
      console.error('Error al añadir finanza al grupo', error);
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
        </div>
      )}

      {user?.id_rol === 1 && group && (
        <div>
          <button type="button" className="btn btn-info" data-bs-toggle="modal" data-bs-target="#addFinanceModal" onClick={fetchFinances}>
            Add Finance
          </button>
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
                        value={selectedFinance || ''}
                        onChange={(e) => setSelectedFinance(parseInt(e.target.value))}
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
                      <button type="submit" className="btn btn-primary" disabled={!selectedFinance}>
                        Añadir Finanza
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <section className="group-finances">
            <h3>Group Finances</h3>
            <ul>
              {Array.isArray(group.finances) && group.finances.length > 0 ? (
                group.finances.map((finance) => (
                  <li key={finance.id} className="finance-item">
                    <div className="finance-logo">
                      <img
                        src={`https://unavatar.io/${finance.name}`}
                        alt={`${finance.name} logo`}
                        className="finance-logo-img"
                      />
                    </div>
                    <div className="finance-info">
                      <strong>{finance.name}</strong>
                      <p>{finance.description || 'No description available'}</p>
                    </div>
                    <div className="transaction-amount">
                      <span className={`amount ${finance.category === "Gasto" ? "expense" : "income"}`}>
                        {finance.category === "Gasto" ? "-" : "+"} {finance.amount} $
                      </span>
                    </div>
                  </li>
                ))
              ) : (
                <p>Aun no hay finanzas en este grupo...</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}


//           {/* Modal para eliminar grupo */}
//           <div className="modal fade" id="deleteGroup" aria-labelledby="deleteGroupLabel" aria-hidden="true">
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h1 className="modal-title fs-5" id="deleteGroupLabel">Seguro que deseas eliminar el grupo</h1>
//                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                 </div>
//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
//                   <button type="button" className="btn btn-danger" onClick={deleteGroup}>Eliminar Grupo</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
