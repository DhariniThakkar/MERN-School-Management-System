import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFollowups, addTeacherFollowupUpdate } from '../../redux/followupRelated/followupHandle';
import { Paper, Button, TextField } from '@mui/material';
import TableViewTemplate from '../../components/TableViewTemplate';

const TeacherFollowUps = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { followupsList, loading, response } = useSelector((state) => state.followup);

  const [noteById, setNoteById] = useState({});

  useEffect(() => {
    // Teachers can see followups for their school and filter client-side to assigned ones
    dispatch(getAllFollowups(currentUser.school._id));
  }, [dispatch, currentUser.school._id]);

  const assignedFollowups = (followupsList || []).filter((fu) => fu.assignedTo?._id === currentUser._id);

  const teacherColumns = [
    { id: 'studentName', label: 'Student', minWidth: 150 },
    { id: 'studentMobile', label: 'Mobile', minWidth: 120 },
    { id: 'sclass', label: 'Class', minWidth: 100 },
    { id: 'specificFollowUpDate', label: 'Follow-Up Date', minWidth: 140 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'update', label: 'Add Update', minWidth: 300 },
  ];

  const handleSubmitUpdate = (id) => {
    const note = noteById[id] || '';
    if (!note) return;
    dispatch(addTeacherFollowupUpdate(id, note, currentUser._id)).then(() => {
      setNoteById((prev) => ({ ...prev, [id]: '' }));
      dispatch(getAllFollowups(currentUser.school._id));
    });
  };

  const rows = assignedFollowups.map((fu) => {
    const followDate = fu.specificFollowUpDate ? new Date(fu.specificFollowUpDate).toISOString().substring(0, 10) : '';
    return {
      studentName: fu.studentName,
      studentMobile: fu.studentMobile,
      sclass: fu.sclassName?.sclassName || '',
      specificFollowUpDate: followDate,
      status: fu.status,
      update: (
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField
            size="small"
            placeholder="Add note"
            value={noteById[fu._id] || ''}
            onChange={(e) => setNoteById((prev) => ({ ...prev, [fu._id]: e.target.value }))}
          />
          <Button variant="contained" onClick={() => handleSubmitUpdate(fu._id)}>Submit</Button>
        </div>
      ),
      id: fu._id,
    };
  });

  return (
    <div style={{ marginTop: '50px', marginRight: '20px' }}>
      {loading ? (
        <div style={{ fontSize: '20px' }}>Loading...</div>
      ) : response ? (
        <div style={{ fontSize: '20px' }}>No Assigned Follow-Ups</div>
      ) : (
        <>
          <h3 style={{ fontSize: '30px', marginBottom: '40px' }}>My Follow-Ups</h3>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {Array.isArray(assignedFollowups) && assignedFollowups.length > 0 && (
              <TableViewTemplate columns={teacherColumns} rows={rows} />
            )}
          </Paper>
        </>
      )}
    </div>
  );
};

export default TeacherFollowUps;
