import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignFollowup, getAllFollowups, requestFollowupUpdate, updateFollowup } from '../../../redux/followupRelated/followupHandle';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import { Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import TableViewTemplate from '../../../components/TableViewTemplate';

const ShowFollowUps = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { followupsList, loading } = useSelector(state => state.followup);
  const { teachersList } = useSelector(state => state.teacher);

  const adminId = currentUser._id;

  const [selected, setSelected] = useState(null);
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    dispatch(getAllFollowups(adminId));
    dispatch(getAllTeachers(adminId));
  }, [dispatch, adminId]);

  const columns = [
    { id: 'studentName', label: 'Student Name', minWidth: 150 },
    { id: 'parentName', label: 'Parents', minWidth: 150 },
    { id: 'studentMobile', label: 'Mobile', minWidth: 120 },
    { id: 'standard', label: 'Standard', minWidth: 80 },
    { id: 'feedback', label: 'Feedback', minWidth: 90 },
    { id: 'demo', label: 'Demo', minWidth: 170 },
    { id: 'followUpDate', label: 'Follow-Up Date', minWidth: 120 },
    { id: 'assignedTeacher', label: 'Assigned Teacher', minWidth: 140 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 280 },
  ];

  const rows = useMemo(() => (followupsList || []).map(f => {
    const dateString = f.followUpDate ? new Date(f.followUpDate).toISOString().substring(0,10) : '';
    const demoStr = f.demo?.booked ? `Yes - ${f.demo?.dateTime ? new Date(f.demo.dateTime).toLocaleString() : ''}` : `No - ${f.demo?.reason || ''}`;
    return {
      id: f._id,
      studentName: f.studentName,
      parentName: [f.motherName, f.fatherName].filter(Boolean).join(' / '),
      studentMobile: f.studentMobile,
      standard: f.standard,
      feedback: f.feedback,
      demo: demoStr,
      followUpDate: dateString,
      assignedTeacher: f.assignedTeacher?.name || 'Unassigned',
      status: f.status,
      actions: (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="small" variant="outlined" onClick={() => setSelected(f)}>Assign</Button>
          <Button size="small" variant="outlined" onClick={() => { setRequestOpen(true); setSelected(f); }}>Request Update</Button>
          <Button size="small" variant="outlined" onClick={() => dispatch(updateFollowup(f._id, { status: f.status === 'Closed' ? 'Open' : 'Closed' }))}>
            {f.status === 'Closed' ? 'Reopen' : 'Close'}
          </Button>
        </div>
      )
    };
  }), [followupsList, dispatch]);

  const handleAssign = async () => {
    if (selected && assignTeacherId) {
      await dispatch(assignFollowup(selected._id, assignTeacherId));
      setSelected(null);
      setAssignTeacherId('');
      dispatch(getAllFollowups(adminId));
    }
  };

  const handleRequest = async () => {
    if (selected && requestMessage.trim()) {
      await dispatch(requestFollowupUpdate(selected._id, adminId, requestMessage.trim()))
      setRequestMessage('');
      setRequestOpen(false);
    }
  };

  return (
    <div style={{ marginTop: '50px', marginRight: '20px' }}>
      {loading ? (
        <div style={{ fontSize: '20px' }}>Loading...</div>
      ) : (
        <>
          <h3 style={{ fontSize: '30px', marginBottom: '40px' }}>Follow-Ups</h3>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {Array.isArray(followupsList) && followupsList.length > 0 && (
              <TableViewTemplate columns={columns} rows={rows} />
            )}
          </Paper>

          <div style={{ marginTop: 16 }}>
            <a className="link" href="/Admin/followups/add">Add New Follow-Up</a>
          </div>

          {/* Assign Dialog */}
          <Dialog open={!!selected} onClose={() => setSelected(null)}>
            <DialogTitle>Assign Follow-Up</DialogTitle>
            <DialogContent>
              <TextField
                select
                label="Teacher"
                fullWidth
                value={assignTeacherId}
                onChange={(e) => setAssignTeacherId(e.target.value)}
              >
                {(teachersList || []).map(t => (
                  <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={handleAssign} variant="contained">Assign</Button>
            </DialogActions>
          </Dialog>

          {/* Request Update Dialog */}
          <Dialog open={requestOpen} onClose={() => setRequestOpen(false)}>
            <DialogTitle>Request Update from Teacher</DialogTitle>
            <DialogContent>
              <TextField
                label="Message"
                fullWidth
                multiline
                minRows={3}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRequestOpen(false)}>Cancel</Button>
              <Button onClick={handleRequest} variant="contained">Send Request</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ShowFollowUps;
