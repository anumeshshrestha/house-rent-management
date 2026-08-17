import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Building2,
  Users,
  CreditCard,
  Receipt,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Lock,
  User,
  Save,
  Phone,
  Mail,
  MapPin,
  UserRound,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  DoorOpen,
  Search,
  DollarSign,
  AlertTriangle,
  CalendarDays,
  FileText,
} from "lucide-react";

import "./App.css";

const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "admin123";

const STORAGE = {
  property: "rent_manager_property",
  rooms: "rent_manager_rooms",
  tenants: "rent_manager_tenants",
  payments: "rent_manager_payments",
};

function getStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function money(value) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value) || 0
  );
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function monthName(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("rent_manager_logged_in") === "true"
  );

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={() => {
          localStorage.setItem(
            "rent_manager_logged_in",
            "true"
          );
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <DashboardApp
      onLogout={() => {
        localStorage.removeItem(
          "rent_manager_logged_in"
        );
        setLoggedIn(false);
      }}
    />
  );
}

/* =====================================================
   LOGIN
===================================================== */

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function login(e) {
    e.preventDefault();

    if (
      username.trim() === LOGIN_USERNAME &&
      password === LOGIN_PASSWORD
    ) {
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Building2 size={42} />
        </div>

        <h1>Rent Manager</h1>
        <p className="login-subtitle">
          House Rent Management System
        </p>

        <form onSubmit={login}>
          <div className="form-group">
            <label>Username</label>

            <div className="input-wrapper">
              <User size={18} />

              <input
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="Username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="input-wrapper">
              <Lock size={18} />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

/* =====================================================
   MAIN APP
===================================================== */

function DashboardApp({ onLogout }) {
  const [activePage, setActivePage] =
    useState("Dashboard");

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const menu = [
    ["Dashboard", Home],
    ["Property", Building2],
    ["Rooms", DoorOpen],
    ["Tenants", Users],
    ["Payments", CreditCard],
    ["Invoices", Receipt],
    ["Expenses", Wallet],
    ["Reports", FileText],
    ["Settings", Settings],
  ];

  return (
    <div className="app">
      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : "closed"
        }`}
      >
        <div className="logo">
          <Building2 size={28} />

          {sidebarOpen && (
            <div>
              <h2>Rent Manager</h2>
              <span>House Management</span>
            </div>
          )}
        </div>

        <nav>
          {menu.map(([name, Icon]) => (
            <button
              key={name}
              className={`nav-item ${
                activePage === name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(name)
              }
            >
              <Icon size={20} />

              {sidebarOpen && (
                <span>{name}</span>
              )}
            </button>
          ))}
        </nav>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          <LogOut size={20} />

          {sidebarOpen && (
            <span>Logout</span>
          )}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          <div>
            <h1>{activePage}</h1>
            <p>
              House Rent Management System
            </p>
          </div>
        </header>

        <section className="content">
          {activePage === "Dashboard" && (
            <Dashboard />
          )}

          {activePage === "Property" && (
            <PropertyPage />
          )}

          {activePage === "Rooms" && (
            <RoomsPage />
          )}

          {activePage === "Tenants" && (
            <TenantsPage />
          )}

          {activePage === "Payments" && (
            <PaymentsPage />
          )}

          {activePage === "Invoices" && (
            <InvoicesPage />
          )}

          {activePage === "Expenses" && (
            <ExpensesPage />
          )}

          {activePage === "Reports" && (
            <ReportsPage />
          )}

          {activePage === "Settings" && (
            <SettingsPage />
          )}
        </section>
      </main>
    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {
  const property = getStorage(
    STORAGE.property,
    null
  );

  const rooms = getStorage(
    STORAGE.rooms,
    []
  );

  const tenants = getStorage(
    STORAGE.tenants,
    []
  );

  const payments = getStorage(
    STORAGE.payments,
    []
  );

  const occupied = rooms.filter(
    (r) => r.status === "Occupied"
  ).length;

  const collected = payments.reduce(
    (sum, p) =>
      sum + Number(p.amount || 0),
    0
  );

  const monthlyRent = tenants.reduce(
    (sum, tenant) =>
      sum + Number(tenant.monthlyRent || 0),
    0
  );

  const outstanding = tenants.reduce(
    (sum, tenant) =>
      sum + getTenantBalance(
        tenant,
        payments
      ),
    0
  );

  return (
    <>
      <div className="welcome-card">
        <div>
          <h2>
            Welcome to Rent Manager 👋
          </h2>

          <p>
            {property?.propertyName ||
              "Manage your property, tenants and rent from one place."}
          </p>
        </div>

        <Building2 size={55} />
      </div>

      <div className="stats-grid">
        <Stat
          title="Total Rooms"
          value={rooms.length}
          icon={<Building2 />}
          color="blue"
        />

        <Stat
          title="Occupied Rooms"
          value={occupied}
          icon={<Users />}
          color="green"
        />

        <Stat
          title="Monthly Rent"
          value={`NPR ${money(monthlyRent)}`}
          icon={<Receipt />}
          color="purple"
        />

        <Stat
          title="Outstanding"
          value={`NPR ${money(outstanding)}`}
          icon={<AlertTriangle />}
          color="orange"
        />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Property</h3>

          {property ? (
            <div className="detail-list">
              <div>
                <span>Name</span>
                <strong>
                  {property.propertyName}
                </strong>
              </div>

              <div>
                <span>Address</span>
                <strong>
                  {property.address}
                </strong>
              </div>

              <div>
                <span>Owner</span>
                <strong>
                  {property.ownerName}
                </strong>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <Building2 size={40} />
              <p>
                Property information not added.
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h3>Payment Summary</h3>

          <div className="detail-list">
            <div>
              <span>Total Tenants</span>
              <strong>
                {tenants.length}
              </strong>
            </div>

            <div>
              <span>Total Payments</span>
              <strong>
                NPR {money(collected)}
              </strong>
            </div>

            <div>
              <span>Outstanding</span>
              <strong className="danger-text">
                NPR {money(outstanding)}
              </strong>
            </div>

            <div>
              <span>This Month</span>
              <strong>
                {monthName()}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =====================================================
   PROPERTY
===================================================== */

function PropertyPage() {
  const [form, setForm] = useState(
    getStorage(STORAGE.property, {
      propertyName: "",
      address: "",
      ownerName: "",
      ownerPhone: "",
      ownerEmail: "",
    })
  );

  const [saved, setSaved] =
    useState(false);

  function update(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));

    setSaved(false);
  }

  function save(e) {
    e.preventDefault();

    saveStorage(STORAGE.property, form);
    setSaved(true);
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Property Profile</h2>
          <p>
            Enter your property and owner
            information.
          </p>
        </div>

        <Building2
          size={40}
          color="#2563eb"
        />
      </div>

      <form
        className="form-card"
        onSubmit={save}
      >
        <h3>Property Information</h3>

        <div className="form-grid">
          <Field
            label="Property Name"
            icon={<Building2 size={18} />}
            value={form.propertyName}
            onChange={(v) =>
              update("propertyName", v)
            }
          />

          <Field
            label="Address"
            icon={<MapPin size={18} />}
            value={form.address}
            onChange={(v) =>
              update("address", v)
            }
          />

          <Field
            label="Owner Name"
            icon={<UserRound size={18} />}
            value={form.ownerName}
            onChange={(v) =>
              update("ownerName", v)
            }
          />

          <Field
            label="Phone"
            icon={<Phone size={18} />}
            value={form.ownerPhone}
            onChange={(v) =>
              update("ownerPhone", v)
            }
          />

          <Field
            label="Email"
            icon={<Mail size={18} />}
            value={form.ownerEmail}
            onChange={(v) =>
              update("ownerEmail", v)
            }
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
          >
            <Save size={18} />
            Save Property
          </button>

          {saved && (
            <span className="success-text">
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/* =====================================================
   ROOMS
===================================================== */

function RoomsPage() {
  const [rooms, setRooms] =
    useStoredState(
      STORAGE.rooms,
      []
    );

  const [form, setForm] =
    useState({
      roomNumber: "",
      floor: "",
      roomType: "Single",
      monthlyRent: "",
      status: "Vacant",
    });

  const [editing, setEditing] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  function reset() {
    setForm({
      roomNumber: "",
      floor: "",
      roomType: "Single",
      monthlyRent: "",
      status: "Vacant",
    });

    setEditing(null);
    setShowForm(false);
  }

  function submit(e) {
    e.preventDefault();

    if (!form.roomNumber || !form.monthlyRent) {
      alert(
        "Room number and monthly rent are required."
      );
      return;
    }

    const duplicate = rooms.some(
      (r) =>
        r.roomNumber.toLowerCase() ===
          form.roomNumber
            .trim()
            .toLowerCase() &&
        r.id !== editing
    );

    if (duplicate) {
      alert("This room already exists.");
      return;
    }

    if (editing) {
      setRooms(
        rooms.map((room) =>
          room.id === editing
            ? {
                ...room,
                ...form,
                monthlyRent:
                  Number(form.monthlyRent),
              }
            : room
        )
      );
    } else {
      setRooms([
        ...rooms,
        {
          ...form,
          id: Date.now().toString(),
          monthlyRent:
            Number(form.monthlyRent),
        },
      ]);
    }

    reset();
  }

  function remove(id) {
    if (
      window.confirm(
        "Delete this room?"
      )
    ) {
      setRooms(
        rooms.filter(
          (r) => r.id !== id
        )
      );
    }
  }

  function edit(room) {
    setForm({
      roomNumber: room.roomNumber,
      floor: room.floor,
      roomType: room.roomType,
      monthlyRent: room.monthlyRent,
      status: room.status,
    });

    setEditing(room.id);
    setShowForm(true);
  }

  const occupied = rooms.filter(
    (r) => r.status === "Occupied"
  ).length;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Room Management</h2>
          <p>
            Manage your rooms and monthly rent.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus size={18} />
          Add Room
        </button>
      </div>

      <div className="stats-grid">
        <Stat
          title="Total Rooms"
          value={rooms.length}
          icon={<DoorOpen />}
          color="blue"
        />

        <Stat
          title="Occupied"
          value={occupied}
          icon={<Users />}
          color="green"
        />

        <Stat
          title="Vacant"
          value={
            rooms.length - occupied
          }
          icon={<DoorOpen />}
          color="orange"
        />

        <Stat
          title="Monthly Rent"
          value={`NPR ${money(
            rooms
              .filter(
                (r) =>
                  r.status ===
                  "Occupied"
              )
              .reduce(
                (sum, r) =>
                  sum +
                  Number(
                    r.monthlyRent
                  ),
                0
              )
          )}`}
          icon={<CreditCard />}
          color="purple"
        />
      </div>

      {showForm && (
        <form
          className="form-card"
          onSubmit={submit}
        >
          <div className="form-card-title">
            <h3>
              {editing
                ? "Edit Room"
                : "Add Room"}
            </h3>

            <button
              type="button"
              className="icon-button"
              onClick={reset}
            >
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <Field
              label="Room Number"
              value={form.roomNumber}
              onChange={(v) =>
                setForm({
                  ...form,
                  roomNumber: v,
                })
              }
            />

            <Field
              label="Floor"
              value={form.floor}
              onChange={(v) =>
                setForm({
                  ...form,
                  floor: v,
                })
              }
            />

            <SelectField
              label="Room Type"
              value={form.roomType}
              onChange={(v) =>
                setForm({
                  ...form,
                  roomType: v,
                })
              }
              options={[
                "Single",
                "Double",
                "Family",
                "Studio",
                "Other",
              ]}
            />

            <Field
              label="Monthly Rent"
              type="number"
              value={form.monthlyRent}
              onChange={(v) =>
                setForm({
                  ...form,
                  monthlyRent: v,
                })
              }
            />

            <SelectField
              label="Status"
              value={form.status}
              onChange={(v) =>
                setForm({
                  ...form,
                  status: v,
                })
              }
              options={[
                "Vacant",
                "Occupied",
              ]}
            />
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
            >
              <Save size={18} />
              {editing
                ? "Update Room"
                : "Save Room"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={reset}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-card">
        <h3>All Rooms</h3>

        {rooms.length === 0 ? (
          <Empty
            icon={<DoorOpen size={42} />}
            text="No rooms added yet."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Rent</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <strong>
                        {room.roomNumber}
                      </strong>
                    </td>

                    <td>
                      {room.floor || "-"}
                    </td>

                    <td>
                      {room.roomType}
                    </td>

                    <td>
                      NPR{" "}
                      {money(
                        room.monthlyRent
                      )}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          room.status ===
                          "Occupied"
                            ? "green"
                            : "orange"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>

                    <td>
                      <div className="actions">
                        <button
                          className="small-button edit"
                          onClick={() =>
                            edit(room)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="small-button delete"
                          onClick={() =>
                            remove(room.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   TENANTS
===================================================== */

function TenantsPage() {
  const [tenants, setTenants] =
    useStoredState(
      STORAGE.tenants,
      []
    );

 const [rooms, setRooms] = useStoredState(
  STORAGE.rooms,
  []
);

useEffect(() => {
  const occupiedRoomIds = new Set(
    tenants.map(
      (tenant) => tenant.roomId
    )
  );

  const updatedRooms = rooms.map(
    (room) => ({
      ...room,
      status: occupiedRoomIds.has(room.id)
        ? "Occupied"
        : "Vacant",
    })
  );

  const changed = updatedRooms.some(
    (room, index) =>
      room.status !==
      rooms[index]?.status
  );

  if (changed) {
    setRooms(updatedRooms);
  }
}, [tenants]);

  const [showForm, setShowForm] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const empty = {
    name: "",
    phone: "",
    email: "",
    roomId: "",
    monthlyRent: "",
    dueDay: "5",
    startDate: today(),
  };

  const [form, setForm] =
    useState(empty);

  const [search, setSearch] =
    useState("");

  function roomRent(roomId) {
    const room = rooms.find(
      (r) => r.id === roomId
    );

    return room
      ? room.monthlyRent
      : "";
  }

  function submit(e) {
  e.preventDefault();

  if (
    !form.name ||
    !form.roomId ||
    !form.monthlyRent
  ) {
    alert(
      "Name, room and rent are required."
    );
    return;
  }

  const roomAlreadyUsed =
    tenants.some(
      (t) =>
        t.roomId === form.roomId &&
        t.id !== editing
    );

  if (roomAlreadyUsed) {
    alert(
      "This room already has a tenant."
    );
    return;
  }

  // If editing, get the tenant's previous room
  const oldTenant = editing
    ? tenants.find(
        (t) => t.id === editing
      )
    : null;

  // Save tenant
  if (editing) {
    setTenants(
      tenants.map((tenant) =>
        tenant.id === editing
          ? {
              ...tenant,
              ...form,
              monthlyRent:
                Number(
                  form.monthlyRent
                ),
            }
          : tenant
      )
    );
  } else {
    setTenants([
      ...tenants,
      {
        ...form,
        id: Date.now().toString(),
        monthlyRent:
          Number(form.monthlyRent),
      },
    ]);
  }

  // Update room status
  setRooms(
    rooms.map((room) => {
      // If editing and tenant changed rooms,
      // make the old room vacant
      if (
        oldTenant &&
        oldTenant.roomId !== form.roomId &&
        room.id === oldTenant.roomId
      ) {
        return {
          ...room,
          status: "Vacant",
        };
      }

      // New/current assigned room becomes occupied
      if (room.id === form.roomId) {
        return {
          ...room,
          status: "Occupied",
        };
      }

      return room;
    })
  );

  setForm(empty);
  setEditing(null);
  setShowForm(false);
}

  function edit(tenant) {
    setForm({
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email,
      roomId: tenant.roomId,
      monthlyRent:
        tenant.monthlyRent,
      dueDay: tenant.dueDay,
      startDate: tenant.startDate,
    });

    setEditing(tenant.id);
    setShowForm(true);
  }

 function remove(id) {
  if (
    window.confirm(
      "Delete this tenant?"
    )
  ) {
    const tenant = tenants.find(
      (t) => t.id === id
    );

    // Delete tenant
    setTenants(
      tenants.filter(
        (t) => t.id !== id
      )
    );

    // Make the tenant's room vacant
    if (tenant?.roomId) {
      setRooms(
        rooms.map((room) =>
          room.id === tenant.roomId
            ? {
                ...room,
                status: "Vacant",
              }
            : room
        )
      );
    }
  }
}

  const filtered = tenants.filter(
    (tenant) =>
      tenant.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||
      tenant.phone
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Tenant Management</h2>
          <p>
            Add tenants and assign rooms.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(true)
          }
        >
          <Plus size={18} />
          Add Tenant
        </button>
      </div>

      {showForm && (
        <form
          className="form-card"
          onSubmit={submit}
        >
          <div className="form-card-title">
            <h3>
              {editing
                ? "Edit Tenant"
                : "Add Tenant"}
            </h3>

            <button
              type="button"
              className="icon-button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm(empty);
              }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <Field
              label="Tenant Name"
              value={form.name}
              onChange={(v) =>
                setForm({
                  ...form,
                  name: v,
                })
              }
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(v) =>
                setForm({
                  ...form,
                  phone: v,
                })
              }
            />

            <Field
              label="Email"
              value={form.email}
              onChange={(v) =>
                setForm({
                  ...form,
                  email: v,
                })
              }
            />

            <SelectField
              label="Room"
              value={form.roomId}
              onChange={(v) =>
                setForm({
                  ...form,
                  roomId: v,
                  monthlyRent:
                    roomRent(v),
                })
              }
              options={rooms.map(
                (room) => ({
                  label: `Room ${room.roomNumber} - NPR ${money(
                    room.monthlyRent
                  )}`,
                  value: room.id,
                })
              )}
            />

            <Field
              label="Monthly Rent"
              type="number"
              value={form.monthlyRent}
              onChange={(v) =>
                setForm({
                  ...form,
                  monthlyRent: v,
                })
              }
            />

            <Field
              label="Rent Due Day"
              type="number"
              value={form.dueDay}
              onChange={(v) =>
                setForm({
                  ...form,
                  dueDay: v,
                })
              }
            />

            <Field
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={(v) =>
                setForm({
                  ...form,
                  startDate: v,
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
            >
              <Save size={18} />
              Save Tenant
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <h3>Tenants</h3>
            <p>
              {tenants.length} tenant
              {tenants.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

          <div className="search-box">
            <Search size={17} />

            <input
              placeholder="Search tenant..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Empty
            icon={<Users size={42} />}
            text="No tenants found."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Room</th>
                  <th>Rent</th>
                  <th>Due Day</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (tenant) => {
                    const room =
                      rooms.find(
                        (r) =>
                          r.id ===
                          tenant.roomId
                      );

                    return (
                      <tr
                        key={
                          tenant.id
                        }
                      >
                        <td>
                          <strong>
                            {tenant.name}
                          </strong>
                          <small>
                            {tenant.email ||
                              ""}
                          </small>
                        </td>

                        <td>
                          Room{" "}
                          {room
                            ?.roomNumber ||
                            "-"}
                        </td>

                        <td>
                          NPR{" "}
                          {money(
                            tenant.monthlyRent
                          )}
                        </td>

                        <td>
                          Day{" "}
                          {tenant.dueDay}
                        </td>

                        <td>
                          {tenant.phone ||
                            "-"}
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              className="small-button edit"
                              onClick={() =>
                                edit(
                                  tenant
                                )
                              }
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              className="small-button delete"
                              onClick={() =>
                                remove(
                                  tenant.id
                                )
                              }
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   PAYMENTS
===================================================== */

function PaymentsPage() {
  const tenants = getStorage(
    STORAGE.tenants,
    []
  );

  const [payments, setPayments] =
    useStoredState(
      STORAGE.payments,
      []
    );

  const [form, setForm] =
    useState({
      tenantId: "",
      amount: "",
      date: today(),
      note: "",
    });

  function submit(e) {
    e.preventDefault();

    if (
      !form.tenantId ||
      !form.amount
    ) {
      alert(
        "Select tenant and enter amount."
      );
      return;
    }

    setPayments([
      ...payments,
      {
        id: Date.now().toString(),
        tenantId: form.tenantId,
        amount: Number(form.amount),
        date: form.date,
        note: form.note,
      },
    ]);

    setForm({
      tenantId: "",
      amount: "",
      date: today(),
      note: "",
    });
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Payments</h2>
          <p>
            Record rent payments from tenants.
          </p>
        </div>

        <CreditCard
          size={40}
          color="#2563eb"
        />
      </div>

      <form
        className="form-card"
        onSubmit={submit}
      >
        <h3>Record Payment</h3>

        <div className="form-grid">
          <SelectField
            label="Tenant"
            value={form.tenantId}
            onChange={(v) =>
              setForm({
                ...form,
                tenantId: v,
              })
            }
            options={tenants.map(
              (tenant) => ({
                label: tenant.name,
                value: tenant.id,
              })
            )}
          />

          <Field
            label="Payment Amount"
            type="number"
            value={form.amount}
            onChange={(v) =>
              setForm({
                ...form,
                amount: v,
              })
            }
          />

          <Field
            label="Payment Date"
            type="date"
            value={form.date}
            onChange={(v) =>
              setForm({
                ...form,
                date: v,
              })
            }
          />

          <Field
            label="Note"
            value={form.note}
            onChange={(v) =>
              setForm({
                ...form,
                note: v,
              })
            }
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
          >
            <CreditCard size={18} />
            Save Payment
          </button>
        </div>
      </form>

      <div className="table-card">
        <h3>Payment History</h3>

        {payments.length === 0 ? (
          <Empty
            icon={<CreditCard size={42} />}
            text="No payments recorded."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                {payments
                  .slice()
                  .reverse()
                  .map((payment) => {
                    const tenant =
                      tenants.find(
                        (t) =>
                          t.id ===
                          payment.tenantId
                      );

                    return (
                      <tr
                        key={
                          payment.id
                        }
                      >
                        <td>
                          {payment.date}
                        </td>

                        <td>
                          <strong>
                            {tenant?.name ||
                              "Unknown"}
                          </strong>
                        </td>

                        <td className="success-text">
                          NPR{" "}
                          {money(
                            payment.amount
                          )}
                        </td>

                        <td>
                          {payment.note ||
                            "-"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   INVOICES
===================================================== */

function InvoicesPage() {
  const tenants = getStorage(
    STORAGE.tenants,
    []
  );

  const payments = getStorage(
    STORAGE.payments,
    []
  );

  const invoices = useMemo(() => {
    return tenants.map((tenant) => {
      const previousPayments =
        payments
          .filter(
            (p) =>
              p.tenantId ===
              tenant.id
          )
          .reduce(
            (sum, p) =>
              sum +
              Number(
                p.amount || 0
              ),
            0
          );

      const rent =
        Number(
          tenant.monthlyRent
        ) || 0;

      const balance = Math.max(
        0,
        rent - previousPayments
      );

      return {
        tenant,
        previousPayments,
        rent,
        balance,
      };
    });
  }, [tenants, payments]);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Monthly Invoices</h2>
          <p>
            Current rent invoice and
            outstanding balance.
          </p>
        </div>

        <Receipt
          size={40}
          color="#2563eb"
        />
      </div>

      <div className="invoice-info">
        <CalendarDays size={20} />

        <div>
          <strong>
            Invoice Period: {monthName()}
          </strong>

          <span>
            New monthly rent is added to
            the tenant's outstanding
            balance automatically.
          </span>
        </div>
      </div>

      <div className="invoice-grid">
        {invoices.length === 0 ? (
          <div className="table-card">
            <Empty
              icon={<Receipt size={42} />}
              text="Add tenants first."
            />
          </div>
        ) : (
          invoices.map(
            ({
              tenant,
              previousPayments,
              rent,
              balance,
            }) => (
              <div
                className="invoice-card"
                key={tenant.id}
              >
                <div className="invoice-top">
                  <div>
                    <span>
                      TENANT
                    </span>

                    <h3>
                      {tenant.name}
                    </h3>
                  </div>

                  <Receipt
                    size={25}
                  />
                </div>

                <div className="invoice-line">
                  <span>
                    Monthly Rent
                  </span>

                  <strong>
                    NPR {money(rent)}
                  </strong>
                </div>

                <div className="invoice-line">
                  <span>
                    Payments/Credits
                  </span>

                  <strong className="success-text">
                    - NPR{" "}
                    {money(
                      previousPayments
                    )}
                  </strong>
                </div>

                <div className="invoice-total">
                  <span>
                    Payable Balance
                  </span>

                  <strong
                    className={
                      balance > 0
                        ? "danger-text"
                        : "success-text"
                    }
                  >
                    NPR {money(balance)}
                  </strong>
                </div>

                {balance > 0 && (
                  <div className="overdue-label">
                    <AlertTriangle
                      size={15}
                    />
                    Amount Due
                  </div>
                )}

                {balance === 0 && (
                  <div className="paid-label">
                    <CheckCircle
                      size={15}
                    />
                    Paid
                  </div>
                )}
              </div>
            )
          )
        )}
      </div>

      <div className="important-note">
        <strong>Example:</strong>

        <span>
          If previous balance is NPR
          3,500 and new rent is NPR
          3,500, the invoice becomes
          NPR 7,000. If the tenant pays
          NPR 5,000, the remaining
          payable amount is NPR 2,000.
        </span>
      </div>
    </div>
  );
}

/* =====================================================
   EXPENSES
===================================================== */

function ExpensesPage() {
  const [expenses, setExpenses] =
    useStoredState(
      "rent_manager_expenses",
      []
    );

  const [form, setForm] =
    useState({
      title: "",
      amount: "",
      date: today(),
    });

  function submit(e) {
    e.preventDefault();

    if (!form.title || !form.amount) {
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        ...form,
        amount: Number(
          form.amount
        ),
      },
    ]);

    setForm({
      title: "",
      amount: "",
      date: today(),
    });
  }

  function remove(id) {
    if (
      window.confirm(
        "Delete this expense?"
      )
    ) {
      setExpenses(
        expenses.filter(
          (e) => e.id !== id
        )
      );
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Expenses</h2>
          <p>
            Record property expenses.
          </p>
        </div>

        <Wallet
          size={40}
          color="#2563eb"
        />
      </div>

      <form
        className="form-card"
        onSubmit={submit}
      >
        <h3>Add Expense</h3>

        <div className="form-grid">
          <Field
            label="Expense"
            value={form.title}
            onChange={(v) =>
              setForm({
                ...form,
                title: v,
              })
            }
          />

          <Field
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(v) =>
              setForm({
                ...form,
                amount: v,
              })
            }
          />

          <Field
            label="Date"
            type="date"
            value={form.date}
            onChange={(v) =>
              setForm({
                ...form,
                date: v,
              })
            }
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>
      </form>

      <div className="table-card">
        <h3>Expense History</h3>

        {expenses.length === 0 ? (
          <Empty
            icon={<Wallet size={42} />}
            text="No expenses recorded."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {expenses
                  .slice()
                  .reverse()
                  .map((expense) => (
                    <tr
                      key={
                        expense.id
                      }
                    >
                      <td>
                        {expense.date}
                      </td>

                      <td>
                        {expense.title}
                      </td>

                      <td>
                        NPR{" "}
                        {money(
                          expense.amount
                        )}
                      </td>

                      <td>
                        <button
                          className="small-button delete"
                          onClick={() =>
                            remove(
                              expense.id
                            )
                          }
                        >
                          <Trash2
                            size={16}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   REPORTS
===================================================== */

function ReportsPage() {
  const tenants = getStorage(
    STORAGE.tenants,
    []
  );

  const payments = getStorage(
    STORAGE.payments,
    []
  );

  const expenses = getStorage(
    "rent_manager_expenses",
    []
  );

  const income = payments.reduce(
    (sum, p) =>
      sum + Number(p.amount || 0),
    0
  );

  const expenseTotal =
    expenses.reduce(
      (sum, e) =>
        sum + Number(e.amount || 0),
      0
    );

  const outstanding =
    tenants.reduce(
      (sum, tenant) =>
        sum +
        getTenantBalance(
          tenant,
          payments
        ),
      0
    );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Reports</h2>
          <p>
            Financial overview.
          </p>
        </div>

        <FileText
          size={40}
          color="#2563eb"
        />
      </div>

      <div className="stats-grid">
        <Stat
          title="Total Income"
          value={`NPR ${money(income)}`}
          icon={<DollarSign />}
          color="green"
        />

        <Stat
          title="Expenses"
          value={`NPR ${money(
            expenseTotal
          )}`}
          icon={<Wallet />}
          color="orange"
        />

        <Stat
          title="Outstanding"
          value={`NPR ${money(
            outstanding
          )}`}
          icon={<AlertTriangle />}
          color="purple"
        />

        <Stat
          title="Net Income"
          value={`NPR ${money(
            income - expenseTotal
          )}`}
          icon={<CreditCard />}
          color="blue"
        />
      </div>

      <div className="card">
        <h3>Financial Summary</h3>

        <div className="detail-list">
          <div>
            <span>Tenants</span>
            <strong>
              {tenants.length}
            </strong>
          </div>

          <div>
            <span>Total Payments</span>
            <strong>
              NPR {money(income)}
            </strong>
          </div>

          <div>
            <span>Total Expenses</span>
            <strong>
              NPR {money(expenseTotal)}
            </strong>
          </div>

          <div>
            <span>Net Income</span>
            <strong>
              NPR{" "}
              {money(
                income -
                  expenseTotal
              )}
            </strong>
          </div>

          <div>
            <span>Outstanding Rent</span>
            <strong className="danger-text">
              NPR {money(outstanding)}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SETTINGS
===================================================== */

function SettingsPage() {
  function exportData() {
    const data = {
      property: getStorage(
        STORAGE.property,
        null
      ),
      rooms: getStorage(
        STORAGE.rooms,
        []
      ),
      tenants: getStorage(
        STORAGE.tenants,
        []
      ),
      payments: getStorage(
        STORAGE.payments,
        []
      ),
      expenses: getStorage(
        "rent_manager_expenses",
        []
      ),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download =
      "rent-manager-backup.json";

    a.click();

    URL.revokeObjectURL(url);
  }

  function clearData() {
    if (
      window.confirm(
        "This will delete all property, room, tenant, payment and expense data. Continue?"
      )
    ) {
      Object.values(STORAGE).forEach(
        (key) =>
          localStorage.removeItem(key)
      );

      localStorage.removeItem(
        "rent_manager_expenses"
      );

      window.location.reload();
    }
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>
          <p>
            Backup and application settings.
          </p>
        </div>

        <Settings
          size={40}
          color="#2563eb"
        />
      </div>

      <div className="settings-grid">
        <div className="card">
          <h3>Backup Data</h3>

          <p className="muted">
            Download your property,
            rooms, tenants, payments and
            expenses as a JSON backup.
          </p>

          <button
            className="primary-button"
            onClick={exportData}
          >
            <Save size={18} />
            Export Backup
          </button>
        </div>

        <div className="card danger-card">
          <h3>Delete All Data</h3>

          <p className="muted">
            Delete all application data
            from this browser.
          </p>

          <button
            className="danger-button"
            onClick={clearData}
          >
            <Trash2 size={18} />
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function useStoredState(key, initial) {
  const [state, setState] =
    useState(() =>
      getStorage(key, initial)
    );

  useEffect(() => {
    saveStorage(key, state);
  }, [key, state]);

  return [state, setState];
}

function getTenantBalance(
  tenant,
  payments
) {
  const rent =
    Number(
      tenant.monthlyRent
    ) || 0;

  const paid =
    payments
      .filter(
        (p) =>
          p.tenantId ===
          tenant.id
      )
      .reduce(
        (sum, p) =>
          sum +
          Number(p.amount || 0),
        0
      );

  return Math.max(
    0,
    rent - paid
  );
}

function Stat({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="stat-card">
      <div
        className={`stat-icon ${color}`}
      >
        {icon}
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="input-wrapper">
        {icon}

        <input
          type={type}
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="select-wrapper">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
        >
          <option value="">
            Select...
          </option>

          {options.map((option) => {
            const item =
              typeof option ===
              "string"
                ? {
                    label: option,
                    value: option,
                  }
                : option;

            return (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

function Empty({
  icon,
  text,
}) {
  return (
    <div className="empty-state">
      {icon}
      <p>{text}</p>
    </div>
  );
}

export default App;