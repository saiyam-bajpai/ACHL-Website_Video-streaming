import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Admin.css';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics');

  // Database stats & lists
  const [stats, setStats] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [ticketsList, setTicketsList] = useState([]);

  // Selected User for Seat/Course Management (Super Admin only)
  const [selectedUserForCourses, setSelectedUserForCourses] = useState(null);

  // New User Creation Form (Super Admin only)
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('Admin');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Dynamic Course Form States
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Critical Thinking');
  const [duration, setDuration] = useState('6 Weeks');
  const [format, setFormat] = useState('Live Program');
  const [price, setPrice] = useState('$499');
  const [desc, setDesc] = useState('');
  const [thumbnailText, setThumbnailText] = useState('THINK');
  const [level, setLevel] = useState('Intermediate');
  const [instructor, setInstructor] = useState('Staff Operator');
  const [instructorTitle, setInstructorTitle] = useState('ACHL Lead Instructor');

  // Textarea input states (Parsed on submit)
  const [rawOutcomes, setRawOutcomes] = useState('');
  const [rawCurriculum, setRawCurriculum] = useState('');
  const [rawFaqs, setRawFaqs] = useState('');

  // Inline Student Stats Editing States
  const [editingStatsUserId, setEditingStatsUserId] = useState(null);
  const [inputAttendance, setInputAttendance] = useState('');
  const [inputFeesPaid, setInputFeesPaid] = useState('Paid in Full ($499)');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (parsedUser.role !== 'Admin' && parsedUser.role !== 'SuperAdmin') {
      navigate('/dashboard');
      return;
    }

    loadAdminPanelData();
  }, [navigate]);

  const loadAdminPanelData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsData, usersData, coursesData, ticketsData, analyticsReport] = await Promise.all([
        apiRequest('/admin/stats'),
        apiRequest('/admin/users'),
        apiRequest('/courses'),
        apiRequest('/admin/tickets'),
        apiRequest('/analytics')
      ]);

      setStats(statsData);
      setUsersList(usersData);
      setCoursesList(coursesData);
      setTicketsList(ticketsData);
      setAnalyticsData(analyticsReport);

      // Refresh selected user's data if active
      if (selectedUserForCourses) {
        const freshUser = usersData.find(u => u.id === selectedUserForCourses.id);
        if (freshUser) {
          setSelectedUserForCourses(freshUser);
        }
      }

    } catch (err) {
      setError(err.message || 'Failed to load administrative panel data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setError('');
    setSuccessMsg('');
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      setSuccessMsg('User role updated successfully.');
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to modify privileges.');
    }
  };

  const handleResetPassword = async (userId, userName) => {
    setError('');
    setSuccessMsg('');
    const newPass = window.prompt(`Enter a new password for user "${userName}":`, '123456');
    if (newPass === null) return;
    if (!newPass.trim()) {
      alert('Password cannot be empty.');
      return;
    }

    try {
      await apiRequest(`/admin/users/${userId}/reset-password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword: newPass })
      });
      setSuccessMsg(`Password for ${userName} reset successfully.`);
    } catch (err) {
      setError(err.message || 'Failed to reset user password.');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    setError('');
    setSuccessMsg('');
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This action is irreversible.`)) return;

    try {
      await apiRequest(`/admin/users/${userId}`, { method: 'DELETE' });
      setSuccessMsg('User account deleted successfully.');
      if (selectedUserForCourses && selectedUserForCourses.id === userId) {
        setSelectedUserForCourses(null);
      }
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to delete user account.');
    }
  };

  // Super Admin Enrollments Control
  const handleAddEnrollment = async (courseSlug) => {
    if (!selectedUserForCourses) return;
    setError('');
    setSuccessMsg('');
    try {
      await apiRequest('/superadmin/enrollments', {
        method: 'POST',
        body: JSON.stringify({ userId: selectedUserForCourses.id, courseSlug })
      });
      setSuccessMsg(`Enrolled user in ${courseSlug} successfully.`);
      await loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to add course seat.');
    }
  };

  const handleRemoveEnrollment = async (courseSlug) => {
    if (!selectedUserForCourses) return;
    setError('');
    setSuccessMsg('');
    if (!window.confirm(`Remove enrollment in "${courseSlug}" for ${selectedUserForCourses.name}?`)) return;

    try {
      await apiRequest('/superadmin/enrollments', {
        method: 'DELETE',
        body: JSON.stringify({ userId: selectedUserForCourses.id, courseSlug })
      });
      setSuccessMsg(`Removed user enrollment in ${courseSlug} successfully.`);
      await loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to remove course seat.');
    }
  };

  // Super Admin: Create new User Account
  const handleCreateAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminSuccess('');
    setError('');
    try {
      await apiRequest('/superadmin/create-admin', {
        method: 'POST',
        body: JSON.stringify({ name: newAdminName, email: newAdminEmail, password: newAdminPassword, role: newAdminRole })
      });
      setAdminSuccess(`User account created successfully with role "${newAdminRole}".`);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminRole('Admin');
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to provision account.');
    }
  };

  const handleSaveStudentStats = async (userId) => {
    setError('');
    setSuccessMsg('');
    try {
      await apiRequest(`/admin/users/${userId}/student-stats`, {
        method: 'PUT',
        body: JSON.stringify({ attendance: inputAttendance, feesPaid: inputFeesPaid })
      });
      setSuccessMsg('Student academic stats updated successfully.');
      setEditingStatsUserId(null);
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to update student academic stats.');
    }
  };

  const handleEditInit = (course) => {
    setEditingCourseId(course.id);
    setSlug(course.slug);
    setTitle(course.title);
    setCategory(course.category);
    setDuration(course.duration);
    setFormat(course.format);
    setPrice(course.price);
    setDesc(course.desc);
    setThumbnailText(course.thumbnailText);
    setLevel(course.level || 'Intermediate');
    setInstructor(course.instructor || 'Staff Operator');
    setInstructorTitle(course.instructorTitle || 'ACHL Lead Instructor');

    const outcomesArray = course.outcomes || [];
    setRawOutcomes(outcomesArray.join('\n'));

    const faqArray = course.faqs || [];
    setRawFaqs(faqArray.map(f => `${f.q} | ${f.a}`).join('\n'));

    const curriculumArray = course.curriculum || [];
    setRawCurriculum(curriculumArray.map(c => `${c.module} | ${c.lessons?.join(', ')}`).join('\n'));

    const formAnchor = document.getElementById('course-form-anchor');
    if (formAnchor) {
      formAnchor.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setEditingCourseId(null);
    setSlug('');
    setTitle('');
    setCategory('Critical Thinking');
    setDuration('6 Weeks');
    setFormat('Live Program');
    setPrice('$499');
    setDesc('');
    setThumbnailText('THINK');
    setLevel('Intermediate');
    setInstructor('Staff Operator');
    setInstructorTitle('ACHL Lead Instructor');
    setRawOutcomes('');
    setRawCurriculum('');
    setRawFaqs('');
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const outcomes = rawOutcomes.split('\n').map(o => o.trim()).filter(Boolean);

    const faqs = rawFaqs.split('\n').map(line => {
      const parts = line.split('|');
      if (parts.length < 2) return null;
      return { q: parts[0].trim(), a: parts[1].trim() };
    }).filter(Boolean);

    const curriculum = rawCurriculum.split('\n').map(line => {
      const parts = line.split('|');
      if (!parts[0]) return null;
      const lessons = parts[1] ? parts[1].split(',').map(l => l.trim()).filter(Boolean) : [];
      return { module: parts[0].trim(), lessons };
    }).filter(Boolean);

    const bodyData = {
      slug,
      title,
      category,
      duration,
      format,
      price,
      desc,
      thumbnailText,
      level,
      instructor,
      instructorTitle,
      outcomes,
      curriculum,
      faqs
    };

    try {
      if (editingCourseId) {
        await apiRequest(`/admin/courses/${editingCourseId}`, {
          method: 'PUT',
          body: JSON.stringify(bodyData)
        });
        setSuccessMsg('Program course catalog updated successfully.');
      } else {
        await apiRequest('/admin/courses', {
          method: 'POST',
          body: JSON.stringify(bodyData)
        });
        setSuccessMsg('New program course published successfully.');
      }
      resetForm();
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to commit program course modifications.');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setError('');
    setSuccessMsg('');
    if (!window.confirm('Are you sure you want to permanently delete this course? This removes all active student seats!')) return;

    try {
      await apiRequest(`/admin/courses/${courseId}`, { method: 'DELETE' });
      setSuccessMsg('Program course removed from catalog.');
      loadAdminPanelData();
    } catch (err) {
      setError(err.message || 'Failed to delete course.');
    }
  };

  if (loading) {
    return (
      <main className="admin-page bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Loading administrative data...</h2>
      </main>
    );
  }

  // --- RENDER TAB FUNCTIONS ---
  
  const renderAnalyticsTab = () => {
    if (!analyticsData) return <p>Analytics data unavailable.</p>;
    return (
      <div className="admin-tab-content">
        <Reveal className="admin-section">
          <h2 className="admin-section-title">Academic & Growth Analytics</h2>
          <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '24px' }}>Attribution of visitor arrivals, growth ratios, and academic statistics.</p>
          
          {/* Aligned 3-column grid for metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Unique Monthly Traffic</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.uniqueVisitsMonth.toLocaleString()}</strong>
              <span className="metric-box__sub text-green">▲ 14.2% Growth</span>
            </div>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Avg Session Duration</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.avgSessionDuration}</strong>
              <span className="metric-box__sub">High syllabus engagement</span>
            </div>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Conversion Rate</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.conversionRate}</strong>
              <span className="metric-box__sub text-green">▲ 0.6% vs target</span>
            </div>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Active Students</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.totalStudents}</strong>
              <span className="metric-box__sub">Registered workspace seats</span>
            </div>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Total Courses Catalog</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.totalCourses}</strong>
              <span className="metric-box__sub">Dynamic curriculum tracks</span>
            </div>
            <div className="metric-box" style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
              <span className="metric-box__title">Support Tickets</span>
              <strong className="metric-box__val" style={{ fontSize: '32px' }}>{analyticsData.totalTickets}</strong>
              <span className="metric-box__sub">Filed inquiry submissions</span>
            </div>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          <Reveal delay={0.08} className="admin-section">
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Attribution of visitor arrivals</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Organic Search (Mental Models content)</span>
                  <strong>45%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--cream)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: 'var(--red)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span>Direct (Brand Referrals & Discord)</span>
                  <strong>35%</strong>
                </div>
                <div style={{ height: '6px', background: 'var(--cream)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '35%', height: '100%', background: 'var(--black)' }} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="admin-section">
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Platform Highlights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '8px 12px', background: 'var(--cream)', borderLeft: '3px solid var(--red)', borderRadius: '4px' }}>
                <strong style={{ fontSize: '13px' }}>92% Syllabus Completion</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--cream)', borderLeft: '3px solid var(--black)', borderRadius: '4px' }}>
                <strong style={{ fontSize: '13px' }}>4.2x LTV : CAC ratio</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    );
  };

  const renderUsersTab = () => {
    const studentsOnly = usersList.filter(u => u.role !== 'Admin' && u.role !== 'SuperAdmin');
    return (
      <div className="admin-tab-content">
        <Reveal className="admin-section">
          <h2 className="admin-section-title">User Workspace Seats</h2>
          <p style={{ color: 'var(--grey)', fontSize: '13.5px' }}>Verify active learning seats, billing status, and enrollments.</p>
          
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Role</th>
                  <th>Attendance</th>
                  <th>Tuition Fees</th>
                  <th>Access / Courses</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studentsOnly.map((u) => {
                  const isEditing = editingStatsUserId === u.id;
                  return (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--grey)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={`role-badge role-${(u.role || 'Student').toLowerCase().replace(' ', '')}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="number"
                            className="stats-edit-input"
                            value={inputAttendance}
                            onChange={e => setInputAttendance(e.target.value)}
                          />
                        ) : (
                          `${u.studentStats?.attendance ?? '100'}%`
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            className="stats-edit-select"
                            value={inputFeesPaid}
                            onChange={e => setInputFeesPaid(e.target.value)}
                          >
                            <option value="Paid in Full ($499)">Paid in Full ($499)</option>
                            <option value="Paid in Full ($699)">Paid in Full ($699)</option>
                            <option value="Paid in Full ($899)">Paid in Full ($899)</option>
                            <option value="Scholarship Seat">Scholarship Seat</option>
                            <option value="Pending Settlement">Pending Settlement</option>
                          </select>
                        ) : (
                          u.studentStats?.feesPaid ?? 'Paid ($499)'
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '280px' }}>
                          {u.enrollments?.length ? (
                            u.enrollments.map(e => (
                              <span key={e.courseSlug} style={{ background: 'var(--cream)', border: '1px solid var(--border-soft)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                                {e.courseSlug}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--grey)' }}>No active access</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSaveStudentStats(u.id)} className="btn btn-fill" style={{ padding: '6px 10px', fontSize: '11px', background: '#16a34a', borderColor: '#16a34a' }}>Save</button>
                              <button onClick={() => setEditingStatsUserId(null)} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '11px' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              {user.role === 'SuperAdmin' && (
                                <button
                                  onClick={() => {
                                    setSelectedUserForCourses(u);
                                    setTimeout(() => {
                                      document.getElementById('seat-manager-anchor')?.scrollIntoView({ behavior: 'smooth' });
                                    }, 100);
                                  }}
                                  className="btn btn-outline"
                                  style={{ padding: '6px 10px', fontSize: '11.5px', color: 'var(--maroon)', borderColor: 'var(--maroon)' }}
                                >
                                  Manage Access
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingStatsUserId(u.id);
                                  setInputAttendance(u.studentStats?.attendance ?? '100');
                                  setInputFeesPaid(u.studentStats?.feesPaid ?? 'Paid in Full ($499)');
                                }}
                                className="btn btn-outline"
                                style={{ padding: '6px 10px', fontSize: '11.5px' }}
                              >
                                Edit Stats
                              </button>
                              {user.role === 'SuperAdmin' && (
                                <>
                                  <button onClick={() => handleResetPassword(u.id, u.name)} className="admin-action-btn reset">Key</button>
                                  <button onClick={() => handleDeleteUser(u.id, u.name)} className="admin-action-btn delete">Trash</button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Super Admin enrollment manager console */}
        {user.role === 'SuperAdmin' && selectedUserForCourses && (
          <div id="seat-manager-anchor">
            <Reveal className="admin-section" style={{ border: '2px solid var(--red)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-soft)', paddingBottom: '12px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--black)' }}>
                  🔑 Manage Access Seats: <span style={{ color: 'var(--red)' }}>{selectedUserForCourses.name}</span> ({selectedUserForCourses.email})
                </h3>
                <button onClick={() => setSelectedUserForCourses(null)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  Close Panel
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }} className="courses-grid-management">
                
                {/* Active Enrollments */}
                <div>
                  <h4>Enrolled Programs ({selectedUserForCourses.enrollments?.length || 0})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                    {selectedUserForCourses.enrollments?.length ? (
                      selectedUserForCourses.enrollments.map(e => (
                        <div key={e.courseSlug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--cream)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                          <span style={{ fontWeight: 600, fontSize: '14px' }}>{e.courseSlug}</span>
                          <button onClick={() => handleRemoveEnrollment(e.courseSlug)} style={{ color: 'var(--red)', fontWeight: 'bold', fontSize: '13px' }}>
                            Revoke Seat
                          </button>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--grey)', fontStyle: 'italic', fontSize: '13.5px' }}>This user has no active enrollments.</p>
                    )}
                  </div>
                </div>

                {/* Available catalog programs */}
                <div>
                  <h4>Authorize New Program Enrollment</h4>
                  <p style={{ color: 'var(--grey)', fontSize: '12.5px', marginBottom: '14px' }}>Add catalog authorization key to student workspace.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {coursesList
                      .filter(c => !selectedUserForCourses.enrollments?.some(e => e.courseSlug === c.slug))
                      .map(c => (
                        <div key={c.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--white)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                          <div>
                            <strong style={{ fontSize: '14px' }}>{c.title}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--grey)' }}>{c.slug}</div>
                          </div>
                          <button onClick={() => handleAddEnrollment(c.slug)} className="btn btn-fill" style={{ padding: '6px 12px', fontSize: '12px' }}>
                            Enroll
                          </button>
                        </div>
                      ))
                    }
                    {coursesList.filter(c => !selectedUserForCourses.enrollments?.some(e => e.courseSlug === c.slug)).length === 0 && (
                      <p style={{ color: 'var(--grey)', fontStyle: 'italic', fontSize: '13.5px' }}>Enrolled in all catalog courses.</p>
                    )}
                  </div>
                </div>

              </div>
            </Reveal>
          </div>
        )}
      </div>
    );
  };

  const renderCoursesTab = () => {
    return (
      <div className="admin-tab-content">
        <div className="courses-grid-management" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }}>
          
          {/* Courses list */}
          <Reveal className="admin-section">
            <h2 className="admin-section-title">Course Programs List</h2>
            <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '16px' }}>Active programs displayed in the student catalog.</p>
            
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Badge</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coursesList.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <span style={{ background: 'var(--black)', color: 'var(--red)', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                          {c.thumbnailText}
                        </span>
                      </td>
                      <td>
                        <strong>{c.title}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--grey)' }}>{c.duration} • {c.format}</div>
                      </td>
                      <td><strong style={{ color: 'var(--red)' }}>{c.price}</strong></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleEditInit(c)} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px' }}>Edit</button>
                          <button onClick={() => handleDeleteCourse(c.id)} className="btn btn-fill" style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--red)', borderColor: 'var(--red)' }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Create/Modify Program Form */}
          <div id="course-form-anchor">
            <Reveal className="admin-section admin-form-card">
              <h2 className="admin-section-title" style={{ fontSize: '18px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '10px', marginBottom: '16px' }}>
                {editingCourseId ? '✏️ Modify Program Details' : '➕ Publish New Program'}
              </h2>

              <form onSubmit={handleCourseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label className="admin-form-label">
                  <span>Course Slug (URL identifier)</span>
                  <input type="text" required placeholder="critical-thinking-basics" value={slug} onChange={e => setSlug(e.target.value)} disabled={!!editingCourseId} />
                </label>
                <label className="admin-form-label">
                  <span>Course Title</span>
                  <input type="text" required placeholder="Mental Models & First Principles" value={title} onChange={e => setTitle(e.target.value)} />
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label className="admin-form-label">
                    <span>Category</span>
                    <select value={category} className="admin-select" onChange={e => setCategory(e.target.value)}>
                      <option value="Critical Thinking">Critical Thinking</option>
                      <option value="Entrepreneurship">Entrepreneurship</option>
                      <option value="Startup Building">Startup Building</option>
                      <option value="AI & Modern Skills">AI & Modern Skills</option>
                    </select>
                  </label>
                  <label className="admin-form-label">
                    <span>Level</span>
                    <select value={level} className="admin-select" onChange={e => setLevel(e.target.value)}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="All Levels">All Levels</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label className="admin-form-label">
                    <span>Duration</span>
                    <input type="text" required placeholder="6 Weeks" value={duration} onChange={e => setDuration(e.target.value)} />
                  </label>
                  <label className="admin-form-label">
                    <span>Format</span>
                    <input type="text" required placeholder="Live Program" value={format} onChange={e => setFormat(e.target.value)} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label className="admin-form-label">
                    <span>Price</span>
                    <input type="text" required placeholder="$499" value={price} onChange={e => setPrice(e.target.value)} />
                  </label>
                  <label className="admin-form-label">
                    <span>Badge Tag</span>
                    <input type="text" required placeholder="THINK" value={thumbnailText} onChange={e => setThumbnailText(e.target.value)} />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label className="admin-form-label">
                    <span>Instructor Name</span>
                    <input type="text" required placeholder="Prof. Evelyn Vance" value={instructor} onChange={e => setInstructor(e.target.value)} />
                  </label>
                  <label className="admin-form-label">
                    <span>Instructor Title</span>
                    <input type="text" required placeholder="Director of Studies" value={instructorTitle} onChange={e => setInstructorTitle(e.target.value)} />
                  </label>
                </div>

                <label className="admin-form-label">
                  <span>Description Summary</span>
                  <textarea rows={3} required placeholder="Syllabus overview..." value={desc} onChange={e => setDesc(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'inherit', fontSize: '13.5px' }} />
                </label>

                <label className="admin-form-label">
                  <span>What you will achieve (Outcomes list — one per line)</span>
                  <textarea rows={3} placeholder="Master 12 cognitive templates&#10;Deconstruct complex systems" value={rawOutcomes} onChange={e => setRawOutcomes(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'inherit', fontSize: '13px' }} />
                </label>

                <label className="admin-form-label">
                  <span>Syllabus Curriculum (one module per line. Format: Module Title | Lesson A, Lesson B)</span>
                  <textarea rows={3} placeholder="Module 1: Foundations | Lesson A, Lesson B&#10;Module 2: Problem Framing | Lesson C, Lesson D" value={rawCurriculum} onChange={e => setRawCurriculum(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'inherit', fontSize: '13px' }} />
                </label>

                <label className="admin-form-label">
                  <span>FAQs List (one per line. Format: Question | Answer)</span>
                  <textarea rows={3} placeholder="Who is this for? | Anyone wanting to think better.&#10;Is it live? | Yes, weekly syncs." value={rawFaqs} onChange={e => setRawFaqs(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'inherit', fontSize: '13px' }} />
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button type="submit" className="btn btn-fill" style={{ flex: 1 }}>{editingCourseId ? 'Update Catalog' : 'Publish Program'}</button>
                  {editingCourseId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </Reveal>
          </div>

        </div>
      </div>
    );
  };

  const renderMessagesTab = () => {
    return (
      <div className="admin-tab-content">
        <Reveal className="admin-section">
          <h2 className="admin-section-title">Support Messages & Inquiries</h2>
          <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '24px' }}>
            Direct inbox messages received from the Contact Support form.
          </p>

          {ticketsList.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: 'var(--grey)' }}>No support messages found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ticketsList.map(t => (
                <div key={t.id} style={{ background: 'var(--cream)', border: '1.5px solid var(--border-soft)', padding: '24px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '10px' }}>
                    <div>
                      <strong style={{ fontSize: '15px', color: 'var(--black)' }}>{t.subject}</strong>
                      <div style={{ fontSize: '12.5px', color: 'var(--grey)', marginTop: '2px' }}>
                        From: <strong>{t.user?.name || 'Unknown'}</strong> ({t.user?.email || 'N/A'})
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--grey)' }}>
                      {new Date(t.createdAt).toLocaleDateString()} at {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--charcoal)', whiteSpace: 'pre-wrap' }}>
                    {t.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    );
  };

  const renderAdminsTab = () => {
    const adminUsers = usersList.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin' || u.role === 'Investor');
    return (
      <div className="admin-tab-content">
        <div className="courses-grid-management" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          
          {/* Admin user accounts listing */}
          <Reveal className="admin-section">
            <h2 className="admin-section-title">Privileged Operator Registry</h2>
            <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '16px' }}>
              Account operators with administrative controls or read-only metrics access.
            </p>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Access Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--grey)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className={`role-badge role-${u.role.toLowerCase()}`} style={{ fontWeight: 'bold' }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {u.email !== 'prabaljaiswal69420@gmail.com' ? (
                            <>
                              <button onClick={() => handleRoleChange(u.id, 'Student')} className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--grey)', borderColor: 'var(--border-soft)' }}>
                                Revoke Access
                              </button>
                              <button onClick={() => handleDeleteUser(u.id, u.name)} className="btn btn-fill" style={{ padding: '4px 8px', fontSize: '11px', background: 'var(--red)', borderColor: 'var(--red)' }}>
                                Delete
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: 'var(--grey)' }}>System Owner</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Form to Create Accounts with role dropdown */}
          <Reveal className="admin-section">
            <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-soft)', paddingBottom: '10px', marginBottom: '20px' }}>
              👑 Provision New User Account
            </h3>
            
            {adminSuccess && (
              <div style={{ background: 'rgba(22, 163, 74, 0.05)', color: '#16a34a', borderLeft: '3px solid #16a34a', padding: '10px 14px', borderRadius: '4px', fontSize: '13.5px', marginBottom: '16px' }}>
                {adminSuccess}
              </div>
            )}

            <form onSubmit={handleCreateAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="admin-form-label">
                <span>Full Name</span>
                <input type="text" required placeholder="User Name" value={newAdminName} onChange={e => setNewAdminName(e.target.value)} />
              </label>
              <label className="admin-form-label">
                <span>Email Address</span>
                <input type="email" required placeholder="operator@achl.com" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} />
              </label>
              <label className="admin-form-label">
                <span>Secure Password</span>
                <input type="password" required placeholder="••••••••" value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} />
              </label>

              {/* Added Dropdown selector for Student, Admin, Super Admin, Investor */}
              <label className="admin-form-label">
                <span>Access Privilege Role</span>
                <select 
                  className="admin-select" 
                  value={newAdminRole} 
                  onChange={e => setNewAdminRole(e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-soft)', fontFamily: 'inherit', fontSize: '14px' }}
                >
                  <option value="Student">Student</option>
                  <option value="Admin">Admin</option>
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="Investor">Investor</option>
                </select>
              </label>
              
              <button type="submit" className="btn btn-fill" style={{ marginTop: '12px' }}>
                Provision Account
              </button>
            </form>
          </Reveal>

        </div>
      </div>
    );
  };

  return (
    <main className="admin-page bg-noise">
      <div className="container">
        
        {/* Header Summary */}
        <Reveal style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="eyebrow" style={{ color: 'var(--red)', borderColor: 'rgba(197, 0, 24, 0.2)', background: 'rgba(197, 0, 24, 0.05)' }}>
              Operator Console
            </span>
            <h1 style={{ marginTop: '10px' }}>
              {user && user.role === 'SuperAdmin' ? 'Super Admin Workspace' : 'Administrator Control'}
            </h1>
          </div>
        </Reveal>

        {/* Global Error/Success Alerts */}
        {error && (
          <div style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', borderLeft: '4px solid var(--red)' }}>
            {error}
          </div>
        )}
        {successMsg && (
          <div style={{ color: '#16a34a', background: 'rgba(22, 163, 74, 0.05)', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '24px', borderLeft: '4px solid #16a34a' }}>
            {successMsg}
          </div>
        )}

        {/* Side-by-Side Admin Panel Layout */}
        <div className="admin-grid-layout">
          
          {/* Sticky Left Sidebar Navigator */}
          <aside className="admin-sidebar" style={{ position: 'sticky', top: 'calc(var(--nav-h) + 20px)', background: 'var(--white)', border: '1.5px solid var(--border-soft)', borderRadius: '16px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
            
            {/* Integrated Return to Workspace button at the top to eliminate overlap completely */}
            <Link to="/dashboard" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px 16px', borderColor: 'var(--border-soft)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              ← Exit Operator View
            </Link>

            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--grey)', padding: '0 8px 8px', borderBottom: '1px solid var(--border-soft)', fontWeight: 'bold' }}>Nav Menu</h3>
            
            <button 
              onClick={() => setActiveTab('analytics')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '13.5px', 
                fontWeight: 600, 
                color: activeTab === 'analytics' ? 'var(--white)' : 'var(--charcoal)', 
                background: activeTab === 'analytics' ? 'var(--black)' : 'transparent', 
                textAlign: 'left', 
                width: '100%',
                transition: 'all 0.2s ease',
                lineHeight: '1.2'
              }}
            >
              📈 Platform Analytics
            </button>
            
            <button 
              onClick={() => setActiveTab('users')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '13.5px', 
                fontWeight: 600, 
                color: activeTab === 'users' ? 'var(--white)' : 'var(--charcoal)', 
                background: activeTab === 'users' ? 'var(--black)' : 'transparent', 
                textAlign: 'left', 
                width: '100%',
                transition: 'all 0.2s ease',
                lineHeight: '1.2'
              }}
            >
              👥 Users & Seat Access
            </button>
            
            <button 
              onClick={() => setActiveTab('courses')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '13.5px', 
                fontWeight: 600, 
                color: activeTab === 'courses' ? 'var(--white)' : 'var(--charcoal)', 
                background: activeTab === 'courses' ? 'var(--black)' : 'transparent', 
                textAlign: 'left', 
                width: '100%',
                transition: 'all 0.2s ease',
                lineHeight: '1.2'
              }}
            >
              📚 Program Catalog
            </button>

            <button 
              onClick={() => setActiveTab('messages')} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '13.5px', 
                fontWeight: 600, 
                color: activeTab === 'messages' ? 'var(--white)' : 'var(--charcoal)', 
                background: activeTab === 'messages' ? 'var(--black)' : 'transparent', 
                textAlign: 'left', 
                width: '100%',
                transition: 'all 0.2s ease',
                lineHeight: '1.2'
              }}
            >
              ✉️ Support Messages
            </button>
            
            {user && user.role === 'SuperAdmin' && (
              <button 
                onClick={() => setActiveTab('admins')} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  fontSize: '13.5px', 
                  fontWeight: 600, 
                  color: activeTab === 'admins' ? 'var(--white)' : 'var(--charcoal)', 
                  background: activeTab === 'admins' ? 'var(--black)' : 'transparent', 
                  textAlign: 'left', 
                  width: '100%',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.2'
                }}
              >
                👑 Admin Registry
              </button>
            )}
          </aside>

          {/* Separator Border vertical line */}
          <div className="desktop-divider"></div>

          {/* Right Area Panels content */}
          <div className="admin-content-panel">
            {activeTab === 'analytics' && renderAnalyticsTab()}
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'courses' && renderCoursesTab()}
            {activeTab === 'messages' && renderMessagesTab()}
            {activeTab === 'admins' && user && user.role === 'SuperAdmin' && renderAdminsTab()}
          </div>

        </div>

      </div>
    </main>
  );
}
