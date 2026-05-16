import { useEffect, useState } from "react";
import { FaUserCheck, FaBan } from "react-icons/fa";
import "./manageusers.css";
import API_BASE_URL from "../services/api";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/admin/users`);
            const data = await response.json();
            if (response.ok && data.users) {
                setUsers(data.users);
                setError("");
            } else {
                setError("Failed to load users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Error loading users");
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/ban`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                fetchUsers();
                alert("User status updated successfully");
            } else {
                alert("Failed to update user status");
            }
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Error updating user");
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "N/A";
            return new Intl.DateTimeFormat("en-IN", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch {
            return "N/A";
        }
    };

    return (
        <div className="manageUsersContainer">
            <div className="manageUsersHeader">
                <h1>Manage Users</h1>
            </div>

            <div className="manageUsersContent">
                <div className="usersSearchBox">
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="usersSearchInput"
                    />
                    <span className="usersCount">Total Users: {users.length}</span>
                </div>

                {loading ? (
                    <div className="usersLoading">Loading users...</div>
                ) : error ? (
                    <div className="usersError">{error}</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="usersEmpty">No users found</div>
                ) : (
                    <div className="usersTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className={user.isBanned ? "bannedUser" : ""}>
                                        <td className="userEmail">{user.email || "N/A"}</td>
                                        <td>
                                            <span
                                                className={`userStatus ${user.isBanned ? "banned" : "active"}`}
                                            >
                                                {user.isBanned ? "Banned" : "Active"}
                                            </span>
                                        </td>
                                        <td className="userDate">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="userActions">
                                            <button
                                                className={`actionBtn ${user.isBanned ? "unban" : "ban"}`}
                                                onClick={() => handleBanUser(user._id)}
                                                title={user.isBanned ? "Unban user" : "Ban user"}
                                            >
                                                {user.isBanned ? (
                                                    <>
                                                        <FaUserCheck /> Unban
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaBan /> Ban
                                                    </>
                                                )}
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

export default ManageUsers;
