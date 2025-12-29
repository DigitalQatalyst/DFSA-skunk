import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { Can } from "../RBAC/Can";
import { useAbilityContext } from "../../context/AbilityContext";
import { ServiceRequestForm } from "../Forms/FormPreview";
import { inviteUserFormSchema } from "../Forms/form-schemas/InviteUserFormSchema";
import { submitUserInvite } from "../../pages/api/stage02-Forms/userInvite";
import { useOrganizationInfo } from "../../hooks/useOrganizationInfo";
import { useOrganizationUsers, useInvalidateOrganizationUsers } from "../../hooks/useOrganizationUsers";

// Mock data for roles
const mockRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all features",
    permissions: [
      {
        name: "User Management",
        access: "Full",
      },
      {
        name: "Content Management",
        access: "Full",
      },
      {
        name: "Settings",
        access: "Full",
      },
      {
        name: "Reports",
        access: "Full",
      },
    ],
  },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content but cannot manage users",
    permissions: [
      {
        name: "User Management",
        access: "View Only",
      },
      {
        name: "Content Management",
        access: "Full",
      },
      {
        name: "Settings",
        access: "View Only",
      },
      {
        name: "Reports",
        access: "Full",
      },
    ],
  },
  {
    id: 3,
    name: "Viewer",
    description: "View-only access to content",
    permissions: [
      {
        name: "User Management",
        access: "None",
      },
      {
        name: "Content Management",
        access: "View Only",
      },
      {
        name: "Settings",
        access: "None",
      },
      {
        name: "Reports",
        access: "View Only",
      },
    ],
  },
  {
    id: 4,
    name: "Advisor",
    description: "Can provide advice and recommendations",
    permissions: [
      {
        name: "User Management",
        access: "None",
      },
      {
        name: "Content Management",
        access: "View Only",
      },
      {
        name: "Settings",
        access: "None",
      },
      {
        name: "Reports",
        access: "Full",
      },
    ],
  },
];
export default function UserRolesTab() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { role } = useAbilityContext();
  const isViewer = role === "viewer";
  const { organization } = useOrganizationInfo();
  const { users, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useOrganizationUsers();
  const invalidateUsers = useInvalidateOrganizationUsers();

  const toggleRoleExpand = (roleId: number) => {
    if (expandedRoleId === roleId) {
      setExpandedRoleId(null);
    } else {
      setExpandedRoleId(roleId);
    }
  };

  // Transform API users to display format
  const transformedUsers = users.map((user) => {
    // Map role from kf_accessroles field
    const mapRole = (roleValue?: number | string | null): string => {
      if (!roleValue) return "Viewer";
      const roleNum = typeof roleValue === 'string' ? parseInt(roleValue, 10) : roleValue;

      switch (roleNum) {
        case 123950000:
          return "Admin";
        case 123950001:
          return "Editor";
        case 123950002:
          return "Viewer";
        case 123950003:
          return "Advisor";
        default:
          return "Viewer";
      }
    };

    // Map status from statecode
    const mapStatus = (statecode?: number): string => {
      return statecode === 0 ? "Active" : "Inactive";
    };

    // Format last login date
    const formatDate = (dateString?: string): string => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    return {
      id: user.contactid,
      name: user.fullname || `${user.firstname || ''} ${user.lastname || ''}`.trim() || "Unknown User",
      email: user.emailaddress1 || "N/A",
      role: mapRole(user.kf_accessroles),
      status: mapStatus(user.statecode),
      lastLogin: formatDate(user.modifiedon),
    };
  });

  const handleInviteSubmit = async (formData: any) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform form data to API format
      const inviteData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      };

      // Validate required fields
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "role",
      ];
      const missingFields = requiredFields.filter(
        (field) => !inviteData[field as keyof typeof inviteData]
      );

      if (missingFields.length > 0) {
        throw new Error(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
      }

      await submitUserInvite(inviteData);

      setIsSuccess(true);

      // Close modal and reset after showing success
      setTimeout(() => {
        setShowUserModal(false);
        setIsSuccess(false);
        setSubmitError(null);
        // Refresh user list after successful invite
        invalidateUsers();
      }, 2000);
    } catch (error) {
      let userFriendlyMessage =
        "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("Missing required fields") ||
          error.message.includes("Please fill in")
        ) {
          userFriendlyMessage = error.message;
        } else if (
          error.message.includes("API endpoint") ||
          error.message.includes("temporarily unavailable")
        ) {
          userFriendlyMessage =
            "The invitation service is temporarily unavailable. Please try again in a few moments.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("connect")
        ) {
          userFriendlyMessage =
            "Unable to connect to our servers. Please check your internet connection and try again.";
        } else {
          userFriendlyMessage = error.message;
        }
      }

      setSubmitError(userFriendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setIsSuccess(false);
    setSubmitError(null);
    setIsSubmitting(false);
  };
  return (
    <div className="space-y-6">
      {/* User Management Section */}
      <Can I="read" a="user-settings">
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              User Management
            </h2>
            <Can I="create" a="user-settings">
              <button
                onClick={() => setShowUserModal(true)}
                className={`inline-flex items-center justify-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700`}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Invite New User
              </button>
            </Can>
          </div>

          {/* Loading State */}
          {usersLoading && (
            <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          )}

          {/* Error State */}
          {usersError && !usersLoading && (
            <div className="bg-white border border-red-200 rounded-md p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading users
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{usersError.message || "Failed to load organization users"}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => refetchUsers()}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!usersLoading && !usersError && transformedUsers.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by inviting a new user to your organization.
              </p>
              <Can I="create" a="user-settings">
                <button
                  onClick={() => setShowUserModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Invite User
                </button>
              </Can>
            </div>
          )}

          {/* User Table */}
          {!usersLoading && !usersError && transformedUsers.length > 0 && (
          <div className="hidden lg:block bg-white border border-gray-200 rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Names
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64 max-w-64"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Last Login
                    </th>
                    <th
                      scope="col"
                      className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transformedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap w-64 max-w-64">
                        <div className="text-sm text-gray-500 truncate" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.role}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-blue-600 hover:text-blue-900 cursor-pointer">
                          Contact Support
                        </span>
                        {/* <Can I="update" a="user-settings" passThrough>
                          {(allowed) => {
                            const canManageUsers = allowed && !isViewer;
                            return (
                              <button
                                onClick={(e) => {
                                  if (!canManageUsers) {
                                    e.preventDefault();
                                    return;
                                  }
                                  console.log("Edit user", user.id);
                                }}
                                disabled={!canManageUsers}
                                className={`mr-3 ${
                                  canManageUsers
                                    ? "text-blue-600 hover:text-blue-900"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                            );
                          }}
                        </Can>
                        <Can I="update" a="user-settings" passThrough>
                          {(allowed) => {
                            const canManageUsers = allowed && !isViewer;
                            return (
                              <button
                                onClick={(e) => {
                                  if (!canManageUsers) {
                                    e.preventDefault();
                                    return;
                                  }
                                  console.log("Delete user", user.id);
                                }}
                                disabled={!canManageUsers}
                                className={`mr-3 ${
                                  canManageUsers
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            );
                          }}
                        </Can>
                        <Can I="update" a="user-settings" passThrough>
                          {(allowed) => {
                            const canManageUsers = allowed && !isViewer;
                            return (
                              <button
                                onClick={(e) => {
                                  if (!canManageUsers) {
                                    e.preventDefault();
                                    return;
                                  }
                                  console.log("Manage access", user.id);
                                }}
                                disabled={!canManageUsers}
                                className={
                                  canManageUsers
                                    ? "text-gray-600 hover:text-gray-900"
                                    : "text-gray-400 cursor-not-allowed"
                                }
                              >
                                <KeyIcon className="h-4 w-4" />
                              </button>
                            );
                          }}
                        </Can> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Mobile list */}
          {!usersLoading && !usersError && transformedUsers.length > 0 && (
          <div className="lg:hidden space-y-3">
            {transformedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-md p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {user.email}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {user.role}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Can I="update" a="user-settings" passThrough>
                      {(allowed) => {
                        const canManageUsers = allowed && !isViewer;
                        return (
                          <button
                            onClick={(e) => {
                              if (!canManageUsers) {
                                e.preventDefault();
                                return;
                              }
                              console.log("Edit user", user.id);
                            }}
                            disabled={!canManageUsers}
                            className={`p-2 rounded ${
                              canManageUsers
                                ? "hover:bg-gray-50"
                                : "cursor-not-allowed opacity-50"
                            }`}
                            aria-label="Edit user"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        );
                      }}
                    </Can>
                    <Can I="update" a="user-settings" passThrough>
                      {(allowed) => {
                        const canManageUsers = allowed && !isViewer;
                        return (
                          <button
                            onClick={(e) => {
                              if (!canManageUsers) {
                                e.preventDefault();
                                return;
                              }
                              console.log("Delete user", user.id);
                            }}
                            disabled={!canManageUsers}
                            className={`p-2 rounded ${
                              canManageUsers
                                ? "hover:bg-gray-50 text-red-600"
                                : "cursor-not-allowed opacity-50 text-gray-400"
                            }`}
                            aria-label="Delete user"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        );
                      }}
                    </Can>
                    <Can I="update" a="user-settings">
                      <button
                        className={`p-2 rounded hover:bg-gray-50
                           `}
                        aria-label="Manage access"
                      >
                        <KeyIcon className="h-4 w-4" />
                      </button>
                    </Can>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Last login: {user.lastLogin}
                </div>
              </div>
            ))}
          </div>
          )}
        </section>
      </Can>
      {/* Roles & Permissions Section */}
      <Can I="read" a="user-settings">
        <section>
          <div className="flex flex-col sm:flex-row sm:justify-between items-stretch sm:items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Roles & Permissions
            </h2>
            <div className="hidden">
              <Can I="create" a="user-settings">
                <button
                  className={
                    "inline-flex items-center justify-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700"
                  }
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create New Role
                </button>
              </Can>
            </div>
          </div>
          <div className="space-y-3">
            {mockRoles.map((role) => (
              <div
                key={role.id}
                className="border border-gray-200 rounded-md bg-white overflow-hidden"
              >
                <div
                  className="px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleRoleExpand(role.id)}
                >
                  <div className="min-w-0">
                    <h3 className="text-md font-medium text-gray-900">
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <div className="self-start sm:self-auto">
                    {expandedRoleId === role.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                {expandedRoleId === role.id && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Permissions:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {role.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {permission.name}:
                          </span>
                          <span
                            className={`font-medium ${
                              permission.access === "Full"
                                ? "text-green-600"
                                : permission.access === "View Only"
                                ? "text-blue-600"
                                : "text-red-600"
                            }`}
                          >
                            {permission.access}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </Can>
      {/* External Identities & SSO Section (Coming Soon) */}
      <section className="opacity-50 cursor-not-allowed">
        <div className="flex items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            External Identities & SSO
          </h2>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Coming Soon
          </span>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-md">
          <p className="text-gray-500">
            Configure Single Sign-On and manage external identity providers.
          </p>
        </div>
      </section>
      {/* User Invite Modal */}
      {showUserModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Invite New User
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className={isSuccess || submitError ? "p-6" : ""}>
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Invitation Sent!
                  </h4>
                  <p className="text-gray-600">
                    The user invitation has been sent successfully. Login
                    details will be sent to their email address.
                  </p>
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Invitation Failed
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            {submitError}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isSubmitting ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Sending invitation...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="invite-user-form-wrapper">
                      <style>{`
                                        .invite-user-form-wrapper .max-w-12xl {
                                            padding-left: 0 !important;
                                            padding-right: 0 !important;
                                            padding-top: 0 !important;
                                            padding-bottom: 0 !important;
                                        }
                                        .invite-user-form-wrapper .flex.justify-end.items-center.mb-4 {
                                            margin-bottom: 0 !important;
                                        }
                                        .invite-user-form-wrapper .bg-white.rounded-lg.shadow-sm.border {
                                            padding: 1.5rem !important;
                                        }
                                        .invite-user-form-wrapper .mb-8 {
                                            margin-bottom: 0 !important;
                                        }
                                        .invite-user-form-wrapper .space-y-10 {
                                            gap: 1.5rem !important;
                                        }
                                        .invite-user-form-wrapper .pt-8 {
                                            padding-top: 1.5rem !important;
                                        }
                                    `}</style>
                      <ServiceRequestForm
                        schema={inviteUserFormSchema}
                        onSubmit={handleInviteSubmit}
                        enablePersistence={false}
                        enableAutoSave={false}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
