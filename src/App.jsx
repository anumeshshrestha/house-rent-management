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

import { supabase } from "./supabase";
import "./App.css";

/* =====================================================
   LOGIN SETTINGS
===================================================== */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const LOGIN_STORAGE_KEY = "rent_manager_logged_in";

/* =====================================================
   CONSTANTS
===================================================== */

const EMPTY_PROPERTY = {
  propertyName: "",
  address: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(value) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value) || 0
  );
}

function monthName(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

/* =====================================================
   APP
===================================================== */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLogin =
      localStorage.getItem(LOGIN_STORAGE_KEY);

    setLoggedIn(savedLogin === "true");
    setLoading(false);
  }, []);

  function handleLogin() {
    localStorage.setItem(
      LOGIN_STORAGE_KEY,
      "true"
    );

    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem(
      LOGIN_STORAGE_KEY
    );

    setLoggedIn(false);
  }

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <Building2 size={42} />
          </div>

          <h1>Rent Manager</h1>

          <p className="login-subtitle">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }

  return (
    <DashboardApp
      onLogout={handleLogout}
    />
  );
}

/* =====================================================
   LOGIN
===================================================== */

function LoginPage({ onLogin }) {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function login(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const enteredUsername =
      username.trim().toLowerCase();

    const enteredPassword =
      password;

    if (
      enteredUsername ===
        ADMIN_USERNAME &&
      enteredPassword ===
        ADMIN_PASSWORD
    ) {
      onLogin();
      return;
    }

    setError(
      "Invalid username or password."
    );

    setLoading(false);
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
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(
                    e.target.value
                  );
                  setError("");
                }}
                placeholder="Username"
                autoComplete="username"
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
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );
                  setError("");
                }}
                placeholder="Password"
                autoComplete="current-password"
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
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =====================================================
   MAIN DASHBOARD
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
          sidebarOpen
            ? "open"
            : "closed"
        }`}
      >
        <div className="logo">
          <Building2 size={28} />

          {sidebarOpen && (
            <div>
              <h2>Rent Manager</h2>
              <span>
                House Management
              </span>
            </div>
          )}
        </div>

        <nav>
          {menu.map(
            ([name, Icon]) => (
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
                  <span>
                    {name}
                  </span>
                )}
              </button>
            )
          )}
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
              setSidebarOpen(
                !sidebarOpen
              )
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
              House Rent Management
              System
            </p>
          </div>
        </header>

        <section className="content">
          {activePage ===
            "Dashboard" && (
            <Dashboard />
          )}

          {activePage ===
            "Property" && (
            <PropertyPage />
          )}

          {activePage === "Rooms" && (
            <RoomsPage />
          )}

          {activePage ===
            "Tenants" && (
            <TenantsPage />
          )}

          {activePage ===
            "Payments" && (
            <PaymentsPage />
          )}

          {activePage ===
            "Invoices" && (
            <InvoicesPage />
          )}

          {activePage ===
            "Expenses" && (
            <ExpensesPage />
          )}

          {activePage ===
            "Reports" && (
            <ReportsPage />
          )}

          {activePage ===
            "Settings" && (
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
  const [property, setProperty] =
    useState(null);

  const [rooms, setRooms] =
    useState([]);

  const [tenants, setTenants] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadData() {
    setLoading(true);

    const [
      propertyResult,
      roomsResult,
      tenantsResult,
      paymentsResult,
    ] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .maybeSingle(),

      supabase
        .from("rooms")
        .select("*")
        .order("room_number"),

      supabase
        .from("tenants")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("payments")
        .select("*")
        .order("payment_date", {
          ascending: false,
        }),
    ]);

    if (!propertyResult.error) {
      setProperty(
        propertyResult.data
          ? mapPropertyFromDb(
              propertyResult.data
            )
          : null
      );
    }

    if (!roomsResult.error) {
      setRooms(
        roomsResult.data?.map(
          mapRoomFromDb
        ) || []
      );
    }

    if (!tenantsResult.error) {
      setTenants(
        tenantsResult.data?.map(
          mapTenantFromDb
        ) || []
      );
    }

    if (!paymentsResult.error) {
      setPayments(
        paymentsResult.data?.map(
          mapPaymentFromDb
        ) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const occupied =
    rooms.filter(
      (room) =>
        room.status ===
        "Occupied"
    ).length;

  const collected =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment.amount || 0
        ),
      0
    );

  const monthlyRent =
    tenants.reduce(
      (sum, tenant) =>
        sum +
        Number(
          tenant.monthlyRent || 0
        ),
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

  if (loading) {
    return <Loading />;
  }

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
          value={`NPR ${money(
            monthlyRent
          )}`}
          icon={<Receipt />}
          color="purple"
        />

        <Stat
          title="Outstanding"
          value={`NPR ${money(
            outstanding
          )}`}
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
                  {
                    property.propertyName
                  }
                </strong>
              </div>

              <div>
                <span>
                  Address
                </span>

                <strong>
                  {
                    property.address
                  }
                </strong>
              </div>

              <div>
                <span>Owner</span>

                <strong>
                  {
                    property.ownerName
                  }
                </strong>
              </div>
            </div>
          ) : (
            <Empty
              icon={
                <Building2
                  size={40}
                />
              }
              text="Property information not added."
            />
          )}
        </div>

        <div className="card">
          <h3>
            Payment Summary
          </h3>

          <div className="detail-list">
            <div>
              <span>
                Total Tenants
              </span>

              <strong>
                {tenants.length}
              </strong>
            </div>

            <div>
              <span>
                Total Payments
              </span>

              <strong>
                NPR {money(collected)}
              </strong>
            </div>

            <div>
              <span>
                Outstanding
              </span>

              <strong className="danger-text">
                NPR{" "}
                {money(outstanding)}
              </strong>
            </div>

            <div>
              <span>
                This Month
              </span>

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
  const [form, setForm] =
    useState(EMPTY_PROPERTY);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    async function loadProperty() {
      const { data, error } =
        await supabase
          .from("properties")
          .select("*")
          .maybeSingle();

      if (error) {
        alert(error.message);
      } else if (data) {
        setForm(
          mapPropertyFromDb(data)
        );
      }

      setLoading(false);
    }

    loadProperty();
  }, []);

  function update(field, value) {
    setForm((old) => ({
      ...old,
      [field]: value,
    }));

    setSaved(false);
  }

  async function save(e) {
    e.preventDefault();

    setSaving(true);
    setSaved(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "Supabase database access requires an authenticated user. Please configure your Supabase database policies for this application."
      );

      setSaving(false);
      return;
    }

    const { error } =
      await supabase
        .from("properties")
        .upsert(
          {
            user_id: user.id,
            property_name:
              form.propertyName,
            address: form.address,
            owner_name:
              form.ownerName,
            owner_phone:
              form.ownerPhone,
            owner_email:
              form.ownerEmail,
          },
          {
            onConflict: "user_id",
          }
        );

    if (error) {
      alert(error.message);
    } else {
      setSaved(true);
    }

    setSaving(false);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>
            Property Profile
          </h2>

          <p>
            Enter your property and
            owner information.
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
        <h3>
          Property Information
        </h3>

        <div className="form-grid">
          <Field
            label="Property Name"
            icon={
              <Building2 size={18} />
            }
            value={
              form.propertyName
            }
            onChange={(value) =>
              update(
                "propertyName",
                value
              )
            }
          />

          <Field
            label="Address"
            icon={
              <MapPin size={18} />
            }
            value={form.address}
            onChange={(value) =>
              update(
                "address",
                value
              )
            }
          />

          <Field
            label="Owner Name"
            icon={
              <UserRound size={18} />
            }
            value={form.ownerName}
            onChange={(value) =>
              update(
                "ownerName",
                value
              )
            }
          />

          <Field
            label="Phone"
            icon={
              <Phone size={18} />
            }
            value={form.ownerPhone}
            onChange={(value) =>
              update(
                "ownerPhone",
                value
              )
            }
          />

          <Field
            label="Email"
            icon={
              <Mail size={18} />
            }
            value={form.ownerEmail}
            onChange={(value) =>
              update(
                "ownerEmail",
                value
              )
            }
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Property"}
          </button>

          {saved && (
            <span className="success-text">
              ✓ Saved to database
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
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      roomNumber: "",
      floor: "",
      roomType: "Single",
      monthlyRent: "",
    });

  const [editing, setEditing] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  async function loadRooms() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("rooms")
        .select("*")
        .order("room_number");

    if (error) {
      alert(error.message);
    } else {
      setRooms(
        data?.map(
          mapRoomFromDb
        ) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function reset() {
    setForm({
      roomNumber: "",
      floor: "",
      roomType: "Single",
      monthlyRent: "",
    });

    setEditing(null);
    setShowForm(false);
  }

  async function submit(e) {
    e.preventDefault();

    if (
      !form.roomNumber.trim() ||
      !form.monthlyRent
    ) {
      alert(
        "Room number and monthly rent are required."
      );

      return;
    }

    const duplicate =
      rooms.some(
        (room) =>
          room.roomNumber
            .trim()
            .toLowerCase() ===
            form.roomNumber
              .trim()
              .toLowerCase() &&
          room.id !== editing
      );

    if (duplicate) {
      alert(
        "This room already exists."
      );

      return;
    }

    const roomData = {
      room_number:
        form.roomNumber.trim(),
      floor: form.floor || "",
      room_type: form.roomType,
      monthly_rent:
        Number(form.monthlyRent),
    };

    let result;

    if (editing) {
      result =
        await supabase
          .from("rooms")
          .update(roomData)
          .eq("id", editing);
    } else {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert(
          "Supabase database access requires authentication."
        );
        return;
      }

      result =
        await supabase
          .from("rooms")
          .insert({
            ...roomData,
            user_id: user.id,
            status: "Vacant",
          });
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    await loadRooms();
    reset();
  }

  async function remove(id) {
    const { data: tenant } =
      await supabase
        .from("tenants")
        .select("id,name")
        .eq("room_id", id)
        .maybeSingle();

    if (tenant) {
      alert(
        `This room is assigned to ${tenant.name}. Remove or move the tenant first.`
      );

      return;
    }

    if (
      !window.confirm(
        "Delete this room?"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("rooms")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadRooms();
  }

  function edit(room) {
    setForm({
      roomNumber:
        room.roomNumber,
      floor: room.floor,
      roomType:
        room.roomType,
      monthlyRent:
        room.monthlyRent,
    });

    setEditing(room.id);
    setShowForm(true);
  }

  const occupied =
    rooms.filter(
      (room) =>
        room.status ===
        "Occupied"
    ).length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>
            Room Management
          </h2>

          <p>
            Manage your rooms and
            monthly rent.
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
            rooms.length -
            occupied
          }
          icon={<DoorOpen />}
          color="orange"
        />

        <Stat
          title="Monthly Rent"
          value={`NPR ${money(
            rooms
              .filter(
                (room) =>
                  room.status ===
                  "Occupied"
              )
              .reduce(
                (sum, room) =>
                  sum +
                  Number(
                    room.monthlyRent
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
              value={
                form.roomNumber
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  roomNumber:
                    value,
                })
              }
            />

            <Field
              label="Floor"
              value={form.floor}
              onChange={(value) =>
                setForm({
                  ...form,
                  floor: value,
                })
              }
            />

            <SelectField
              label="Room Type"
              value={
                form.roomType
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  roomType:
                    value,
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
              value={
                form.monthlyRent
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  monthlyRent:
                    value,
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
            icon={
              <DoorOpen
                size={42}
              />
            }
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
                {rooms.map(
                  (room) => (
                    <tr
                      key={
                        room.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            room.roomNumber
                          }
                        </strong>
                      </td>

                      <td>
                        {room.floor ||
                          "-"}
                      </td>

                      <td>
                        {
                          room.roomType
                        }
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
                          {
                            room.status
                          }
                        </span>
                      </td>

                      <td>
                        <div className="actions">
                          <button
                            className="small-button edit"
                            onClick={() =>
                              edit(
                                room
                              )
                            }
                          >
                            <Pencil
                              size={
                                16
                              }
                            />
                          </button>

                          <button
                            className="small-button delete"
                            onClick={() =>
                              remove(
                                room.id
                              )
                            }
                          >
                            <Trash2
                              size={
                                16
                              }
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
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
   TENANTS
===================================================== */

function TenantsPage() {
  const [tenants, setTenants] =
    useState([]);

  const [rooms, setRooms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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

  async function loadData() {
    setLoading(true);

    const [
      tenantsResult,
      roomsResult,
    ] = await Promise.all([
      supabase
        .from("tenants")
        .select("*")
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("rooms")
        .select("*")
        .order("room_number"),
    ]);

    if (tenantsResult.error) {
      alert(
        tenantsResult.error.message
      );
    } else {
      setTenants(
        tenantsResult.data?.map(
          mapTenantFromDb
        ) || []
      );
    }

    if (roomsResult.error) {
      alert(
        roomsResult.error.message
      );
    } else {
      setRooms(
        roomsResult.data?.map(
          mapRoomFromDb
        ) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const availableRooms =
    rooms.filter((room) => {
      const usedByOtherTenant =
        tenants.some(
          (tenant) =>
            tenant.roomId ===
              room.id &&
            tenant.id !==
              editing
        );

      return !usedByOtherTenant;
    });

  function roomRent(roomId) {
    const room = rooms.find(
      (room) =>
        room.id === roomId
    );

    return room
      ? room.monthlyRent
      : "";
  }

  async function submit(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
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
        (tenant) =>
          tenant.roomId ===
            form.roomId &&
          tenant.id !== editing
      );

    if (roomAlreadyUsed) {
      alert(
        "This room is already occupied."
      );

      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        "Supabase database access requires authentication."
      );
      return;
    }

    const tenantData = {
      name: form.name.trim(),
      phone: form.phone || "",
      email: form.email || "",
      room_id: form.roomId,
      monthly_rent:
        Number(form.monthlyRent),
      due_day:
        Number(form.dueDay),
      start_date:
        form.startDate,
    };

    let result;

    if (editing) {
      result =
        await supabase
          .from("tenants")
          .update(tenantData)
          .eq("id", editing);
    } else {
      result =
        await supabase
          .from("tenants")
          .insert({
            ...tenantData,
            user_id: user.id,
          });
    }

    if (result.error) {
      alert(result.error.message);
      return;
    }

    await loadData();

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
      startDate:
        tenant.startDate,
    });

    setEditing(tenant.id);
    setShowForm(true);
  }

  async function remove(id) {
    if (
      !window.confirm(
        "Delete this tenant?"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("tenants")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadData();
  }

  const filtered =
    tenants.filter(
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>
            Tenant Management
          </h2>

          <p>
            Add tenants and assign
            rooms.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setEditing(null);
            setForm(empty);
            setShowForm(true);
          }}
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
              onChange={(value) =>
                setForm({
                  ...form,
                  name: value,
                })
              }
            />

            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                setForm({
                  ...form,
                  phone: value,
                })
              }
            />

            <Field
              label="Email"
              value={form.email}
              onChange={(value) =>
                setForm({
                  ...form,
                  email: value,
                })
              }
            />

            <SelectField
              label="Room"
              value={form.roomId}
              onChange={(value) =>
                setForm({
                  ...form,
                  roomId: value,
                  monthlyRent:
                    roomRent(value),
                })
              }
              options={availableRooms.map(
                (room) => ({
                  label: `Room ${room.roomNumber} - NPR ${money(
                    room.monthlyRent
                  )}`,
                  value: room.id,
                })
              )}
            />

            {availableRooms.length ===
              0 && (
              <div
                style={{
                  color:
                    "#dc2626",
                  fontSize:
                    "14px",
                  paddingTop:
                    "8px",
                }}
              >
                No vacant rooms
                available.
              </div>
            )}

            <Field
              label="Monthly Rent"
              type="number"
              value={
                form.monthlyRent
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  monthlyRent:
                    value,
                })
              }
            />

            <Field
              label="Rent Due Day"
              type="number"
              min="1"
              max="31"
              value={form.dueDay}
              onChange={(value) =>
                setForm({
                  ...form,
                  dueDay: value,
                })
              }
            />

            <Field
              label="Start Date"
              type="date"
              value={
                form.startDate
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  startDate:
                    value,
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={
                availableRooms.length ===
                  0 &&
                !editing
              }
            >
              <Save size={18} />

              {editing
                ? "Update Tenant"
                : "Save Tenant"}
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
              {tenants.length !==
              1
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
                setSearch(
                  e.target.value
                )
              }
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <Empty
            icon={
              <Users size={42} />
            }
            text="No tenants found."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>
                    Tenant
                  </th>
                  <th>Room</th>
                  <th>Rent</th>
                  <th>
                    Due Day
                  </th>
                  <th>Phone</th>
                  <th>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (tenant) => {
                    const room =
                      rooms.find(
                        (room) =>
                          room.id ===
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
                            {
                              tenant.name
                            }
                          </strong>

                          <small>
                            {
                              tenant.email
                            }
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
                          {
                            tenant.dueDay
                          }
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
                                size={
                                  16
                                }
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
                                size={
                                  16
                                }
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
  const [tenants, setTenants] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      tenantId: "",
      amount: "",
      date: today(),
      note: "",
    });

  async function loadData() {
    setLoading(true);

    const [
      tenantsResult,
      paymentsResult,
    ] = await Promise.all([
      supabase
        .from("tenants")
        .select("*")
        .order("name"),

      supabase
        .from("payments")
        .select("*")
        .order("payment_date", {
          ascending: false,
        }),
    ]);

    if (tenantsResult.error) {
      alert(
        tenantsResult.error.message
      );
    } else {
      setTenants(
        tenantsResult.data?.map(
          mapTenantFromDb
        ) || []
      );
    }

    if (paymentsResult.error) {
      alert(
        paymentsResult.error.message
      );
    } else {
      setPayments(
        paymentsResult.data?.map(
          mapPaymentFromDb
        ) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submit(e) {
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

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        "Supabase database access requires authentication."
      );
      return;
    }

    const { error } =
      await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          tenant_id:
            form.tenantId,
          amount:
            Number(form.amount),
          payment_date:
            form.date,
          note:
            form.note || "",
        });

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      tenantId: "",
      amount: "",
      date: today(),
      note: "",
    });

    await loadData();
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Payments</h2>

          <p>
            Record rent payments
            from tenants.
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
        <h3>
          Record Payment
        </h3>

        <div className="form-grid">
          <SelectField
            label="Tenant"
            value={
              form.tenantId
            }
            onChange={(value) =>
              setForm({
                ...form,
                tenantId:
                  value,
              })
            }
            options={tenants.map(
              (tenant) => ({
                label:
                  tenant.name,
                value:
                  tenant.id,
              })
            )}
          />

          <Field
            label="Payment Amount"
            type="number"
            value={form.amount}
            onChange={(value) =>
              setForm({
                ...form,
                amount:
                  value,
              })
            }
          />

          <Field
            label="Payment Date"
            type="date"
            value={form.date}
            onChange={(value) =>
              setForm({
                ...form,
                date: value,
              })
            }
          />

          <Field
            label="Note"
            value={form.note}
            onChange={(value) =>
              setForm({
                ...form,
                note: value,
              })
            }
          />
        </div>

        <div className="form-actions">
          <button
            className="primary-button"
            type="submit"
          >
            <CreditCard
              size={18}
            />
            Save Payment
          </button>
        </div>
      </form>

      <div className="table-card">
        <h3>
          Payment History
        </h3>

        {payments.length ===
        0 ? (
          <Empty
            icon={
              <CreditCard
                size={42}
              />
            }
            text="No payments recorded."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>
                    Tenant
                  </th>
                  <th>
                    Amount
                  </th>
                  <th>
                    Note
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map(
                  (payment) => {
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
                          {
                            payment.date
                          }
                        </td>

                        <td>
                          <strong>
                            {tenant
                              ?.name ||
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
                          {
                            payment.note ||
                            "-"
                          }
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
   INVOICES
===================================================== */

function InvoicesPage() {
  const [tenants, setTenants] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const [
        tenantsResult,
        paymentsResult,
      ] = await Promise.all([
        supabase
          .from("tenants")
          .select("*"),

        supabase
          .from("payments")
          .select("*"),
      ]);

      if (tenantsResult.error) {
        alert(
          tenantsResult.error.message
        );
      } else {
        setTenants(
          tenantsResult.data?.map(
            mapTenantFromDb
          ) || []
        );
      }

      if (paymentsResult.error) {
        alert(
          paymentsResult.error.message
        );
      } else {
        setPayments(
          paymentsResult.data?.map(
            mapPaymentFromDb
          ) || []
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  const invoices =
    useMemo(() => {
      return tenants.map(
        (tenant) => {
          const previousPayments =
            payments
              .filter(
                (payment) =>
                  payment.tenantId ===
                  tenant.id
              )
              .reduce(
                (
                  sum,
                  payment
                ) =>
                  sum +
                  Number(
                    payment.amount ||
                      0
                  ),
                0
              );

          const rent =
            Number(
              tenant.monthlyRent
            ) || 0;

          const balance =
            Math.max(
              0,
              rent -
                previousPayments
            );

          return {
            tenant,
            previousPayments,
            rent,
            balance,
          };
        }
      );
    }, [tenants, payments]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>
            Monthly Invoices
          </h2>

          <p>
            Current rent invoice
            and outstanding
            balance.
          </p>
        </div>

        <Receipt
          size={40}
          color="#2563eb"
        />
      </div>

      <div className="invoice-info">
        <CalendarDays
          size={20}
        />

        <div>
          <strong>
            Invoice Period:{" "}
            {monthName()}
          </strong>

          <span>
            Monthly rent and
            payments are
            calculated from your
            database.
          </span>
        </div>
      </div>

      <div className="invoice-grid">
        {invoices.length ===
        0 ? (
          <div className="table-card">
            <Empty
              icon={
                <Receipt
                  size={42}
                />
              }
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
                key={
                  tenant.id
                }
              >
                <div className="invoice-top">
                  <div>
                    <span>
                      TENANT
                    </span>

                    <h3>
                      {
                        tenant.name
                      }
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
                    NPR{" "}
                    {money(rent)}
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
                      balance >
                      0
                        ? "danger-text"
                        : "success-text"
                    }
                  >
                    NPR{" "}
                    {money(
                      balance
                    )}
                  </strong>
                </div>

                {balance >
                  0 && (
                  <div className="overdue-label">
                    <AlertTriangle
                      size={
                        15
                      }
                    />
                    Amount Due
                  </div>
                )}

                {balance ===
                  0 && (
                  <div className="paid-label">
                    <CheckCircle
                      size={
                        15
                      }
                    />
                    Paid
                  </div>
                )}
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

/* =====================================================
   EXPENSES
===================================================== */

function ExpensesPage() {
  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      title: "",
      amount: "",
      date: today(),
    });

  async function loadExpenses() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", {
          ascending: false,
        });

    if (error) {
      alert(error.message);
    } else {
      setExpenses(
        data?.map(
          mapExpenseFromDb
        ) || []
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (
      !form.title ||
      !form.amount
    ) {
      return;
    }

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        "Supabase database access requires authentication."
      );
      return;
    }

    const { error } =
      await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          title: form.title,
          amount:
            Number(form.amount),
          expense_date:
            form.date,
        });

    if (error) {
      alert(error.message);
      return;
    }

    setForm({
      title: "",
      amount: "",
      date: today(),
    });

    await loadExpenses();
  }

  async function remove(id) {
    if (
      !window.confirm(
        "Delete this expense?"
      )
    ) {
      return;
    }

    const { error } =
      await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    await loadExpenses();
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Expenses</h2>

          <p>
            Record property
            expenses.
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
        <h3>
          Add Expense
        </h3>

        <div className="form-grid">
          <Field
            label="Expense"
            value={form.title}
            onChange={(value) =>
              setForm({
                ...form,
                title: value,
              })
            }
          />

          <Field
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(value) =>
              setForm({
                ...form,
                amount:
                  value,
              })
            }
          />

          <Field
            label="Date"
            type="date"
            value={form.date}
            onChange={(value) =>
              setForm({
                ...form,
                date: value,
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
        <h3>
          Expense History
        </h3>

        {expenses.length ===
        0 ? (
          <Empty
            icon={
              <Wallet size={42} />
            }
            text="No expenses recorded."
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>
                    Expense
                  </th>
                  <th>
                    Amount
                  </th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {expenses.map(
                  (expense) => (
                    <tr
                      key={
                        expense.id
                      }
                    >
                      <td>
                        {
                          expense.date
                        }
                      </td>

                      <td>
                        {
                          expense.title
                        }
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
                            size={
                              16
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  )
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
   REPORTS
===================================================== */

function ReportsPage() {
  const [tenants, setTenants] =
    useState([]);

  const [payments, setPayments] =
    useState([]);

  const [expenses, setExpenses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const [
        tenantsResult,
        paymentsResult,
        expensesResult,
      ] = await Promise.all([
        supabase
          .from("tenants")
          .select("*"),

        supabase
          .from("payments")
          .select("*"),

        supabase
          .from("expenses")
          .select("*"),
      ]);

      if (!tenantsResult.error) {
        setTenants(
          tenantsResult.data?.map(
            mapTenantFromDb
          ) || []
        );
      }

      if (!paymentsResult.error) {
        setPayments(
          paymentsResult.data?.map(
            mapPaymentFromDb
          ) || []
        );
      }

      if (!expensesResult.error) {
        setExpenses(
          expensesResult.data?.map(
            mapExpenseFromDb
          ) || []
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  const income =
    payments.reduce(
      (sum, payment) =>
        sum +
        Number(
          payment.amount || 0
        ),
      0
    );

  const expenseTotal =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount || 0
        ),
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

  if (loading) {
    return <Loading />;
  }

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
          value={`NPR ${money(
            income
          )}`}
          icon={
            <DollarSign />
          }
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
          icon={
            <AlertTriangle />
          }
          color="purple"
        />

        <Stat
          title="Net Income"
          value={`NPR ${money(
            income -
              expenseTotal
          )}`}
          icon={
            <CreditCard />
          }
          color="blue"
        />
      </div>

      <div className="card">
        <h3>
          Financial Summary
        </h3>

        <div className="detail-list">
          <div>
            <span>
              Tenants
            </span>

            <strong>
              {tenants.length}
            </strong>
          </div>

          <div>
            <span>
              Total Payments
            </span>

            <strong>
              NPR {money(income)}
            </strong>
          </div>

          <div>
            <span>
              Total Expenses
            </span>

            <strong>
              NPR{" "}
              {money(
                expenseTotal
              )}
            </strong>
          </div>

          <div>
            <span>
              Net Income
            </span>

            <strong>
              NPR{" "}
              {money(
                income -
                  expenseTotal
              )}
            </strong>
          </div>

          <div>
            <span>
              Outstanding Rent
            </span>

            <strong className="danger-text">
              NPR{" "}
              {money(
                outstanding
              )}
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
  const [exporting, setExporting] =
    useState(false);

  async function exportData() {
    setExporting(true);

    try {
      const [
        propertyResult,
        roomsResult,
        tenantsResult,
        paymentsResult,
        expensesResult,
      ] = await Promise.all([
        supabase
          .from("properties")
          .select("*"),

        supabase
          .from("rooms")
          .select("*"),

        supabase
          .from("tenants")
          .select("*"),

        supabase
          .from("payments")
          .select("*"),

        supabase
          .from("expenses")
          .select("*"),
      ]);

      const data = {
        exportedAt:
          new Date().toISOString(),

        property:
          propertyResult.data ||
          [],

        rooms:
          roomsResult.data || [],

        tenants:
          tenantsResult.data || [],

        payments:
          paymentsResult.data || [],

        expenses:
          expensesResult.data || [],
      };

      const blob =
        new Blob(
          [
            JSON.stringify(
              data,
              null,
              2
            ),
          ],
          {
            type:
              "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "rent-manager-backup.json";

      a.click();

      URL.revokeObjectURL(
        url
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setExporting(false);
    }
  }

  async function clearData() {
    if (
      !window.confirm(
        "This will delete all property, room, tenant, payment and expense data. Continue?"
      )
    ) {
      return;
    }

    const paymentsResult =
      await supabase
        .from("payments")
        .delete()
        .not(
          "id",
          "is",
          null
        );

    if (paymentsResult.error) {
      alert(
        paymentsResult.error.message
      );
      return;
    }

    const tenantsResult =
      await supabase
        .from("tenants")
        .delete()
        .not(
          "id",
          "is",
          null
        );

    if (tenantsResult.error) {
      alert(
        tenantsResult.error.message
      );
      return;
    }

    const expensesResult =
      await supabase
        .from("expenses")
        .delete()
        .not(
          "id",
          "is",
          null
        );

    if (expensesResult.error) {
      alert(
        expensesResult.error.message
      );
      return;
    }

    const roomsResult =
      await supabase
        .from("rooms")
        .delete()
        .not(
          "id",
          "is",
          null
        );

    if (roomsResult.error) {
      alert(
        roomsResult.error.message
      );
      return;
    }

    const propertyResult =
      await supabase
        .from("properties")
        .delete()
        .not(
          "id",
          "is",
          null
        );

    if (propertyResult.error) {
      alert(
        propertyResult.error.message
      );
      return;
    }

    alert(
      "All your data has been deleted."
    );

    window.location.reload();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Settings</h2>

          <p>
            Backup and application
            settings.
          </p>
        </div>

        <Settings
          size={40}
          color="#2563eb"
        />
      </div>

      <div className="settings-grid">
        <div className="card">
          <h3>
            Backup Data
          </h3>

          <p className="muted">
            Download your
            property, rooms,
            tenants, payments
            and expenses as a
            JSON backup.
          </p>

          <button
            className="primary-button"
            onClick={exportData}
            disabled={exporting}
          >
            <Save size={18} />

            {exporting
              ? "Exporting..."
              : "Export Backup"}
          </button>
        </div>

        <div className="card danger-card">
          <h3>
            Delete All Data
          </h3>

          <p className="muted">
            Delete all data
            belonging to your
            account from
            Supabase.
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
   DATABASE MAPPERS
===================================================== */

function mapPropertyFromDb(row) {
  return {
    id: row.id,
    propertyName:
      row.property_name || "",
    address:
      row.address || "",
    ownerName:
      row.owner_name || "",
    ownerPhone:
      row.owner_phone || "",
    ownerEmail:
      row.owner_email || "",
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

function mapRoomFromDb(row) {
  return {
    id: row.id,
    roomNumber:
      row.room_number || "",
    floor:
      row.floor || "",
    roomType:
      row.room_type ||
      "Single",
    monthlyRent:
      Number(
        row.monthly_rent || 0
      ),
    status:
      row.status ||
      "Vacant",
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

function mapTenantFromDb(row) {
  return {
    id: row.id,
    name: row.name || "",
    phone:
      row.phone || "",
    email:
      row.email || "",
    roomId:
      row.room_id,
    monthlyRent:
      Number(
        row.monthly_rent || 0
      ),
    dueDay:
      Number(
        row.due_day || 5
      ),
    startDate:
      row.start_date ||
      today(),
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

function mapPaymentFromDb(row) {
  return {
    id: row.id,
    tenantId:
      row.tenant_id,
    amount:
      Number(
        row.amount || 0
      ),
    date:
      row.payment_date ||
      "",
    note:
      row.note || "",
    createdAt:
      row.created_at,
  };
}

function mapExpenseFromDb(row) {
  return {
    id: row.id,
    title:
      row.title || "",
    amount:
      Number(
        row.amount || 0
      ),
    date:
      row.expense_date ||
      "",
    createdAt:
      row.created_at,
  };
}

/* =====================================================
   BALANCE
===================================================== */

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
        (payment) =>
          payment.tenantId ===
          tenant.id
      )
      .reduce(
        (sum, payment) =>
          sum +
          Number(
            payment.amount || 0
          ),
        0
      );

  return Math.max(
    0,
    rent - paid
  );
}

/* =====================================================
   LOADING
===================================================== */

function Loading() {
  return (
    <div className="page">
      <div
        className="card"
        style={{
          textAlign:
            "center",
          padding: "50px",
        }}
      >
        <Building2
          size={42}
          color="#2563eb"
        />

        <h3>
          Loading...
        </h3>

        <p className="muted">
          Loading data from
          Supabase.
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   STAT
===================================================== */

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

/* =====================================================
   FIELD
===================================================== */

function Field({
  label,
  value,
  onChange,
  type = "text",
  icon,
  min,
  max,
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <div className="input-wrapper">
        {icon}

        <input
          type={type}
          value={
            value ?? ""
          }
          min={min}
          max={max}
          onChange={(e) =>
            onChange(
              e.target.value
            )
          }
        />
      </div>
    </div>
  );
}

/* =====================================================
   SELECT
===================================================== */

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
            onChange(
              e.target.value
            )
          }
        >
          <option value="">
            Select...
          </option>

          {options.map(
            (option) => {
              const item =
                typeof option ===
                "string"
                  ? {
                      label:
                        option,
                      value:
                        option,
                    }
                  : option;

              return (
                <option
                  key={
                    item.value
                  }
                  value={
                    item.value
                  }
                >
                  {item.label}
                </option>
              );
            }
          )}
        </select>
      </div>
    </div>
  );
}

/* =====================================================
   EMPTY
===================================================== */

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