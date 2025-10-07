import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFollowups, assignFollowup, requestUpdateFromTeacher } from '../../../redux/followupRelated/followupHandle';
import { Paper, Button, MenuItem, Select } from '@mui/material';
import TableViewTemplate from '../../../components/TableViewTemplate';
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';

const ShowFollowUps = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);
  const { followupsList, loading, response } = useSelector((state) => state.followup);
  const { teachersList } = useSelector((state) => state.teacher);

  useEffect(() => {
    dispatch(getAllFollowups(currentUser._id));
    dispatch(getAllTeachers(currentUser._id));
  }, [dispatch, currentUser._id]);

  const followupColumns = [
    { id: 'studentName', label: 'Student', minWidth: 150 },
    { id: 'studentMobile', label: 'Mobile', minWidth: 120 },
    { id: 'sclass', label: 'Class', minWidth: 100 },
    { id: 'feedbackType', label: 'Feedback', minWidth: 100 },
    { id: 'demo', label: 'Demo', minWidth: 180 },
    { id: 'specificFollowUpDate', label: 'Follow-Up Date', minWidth: 140 },
    { id: 'assignedTo', label: 'Assigned To', minWidth: 200 },
    { id: 'actions', label: 'Actions', minWidth: 250 },
  ];

  const handleAssign = (followUpId, teacherId) => {
    dispatch(assignFollowup(followUpId, teacherId)).then(() => {
      dispatch(getAllFollowups(currentUser._id));
    });
  };

  const handleRequestUpdate = (followUpId) => {
    dispatch(requestUpdateFromTeacher(followUpId)).then(() => {
      dispatch(getAllFollowups(currentUser._id));
    });
  };

  const followupRows = (followupsList || []).map((fu) => {
    const demoText = fu.demoBooked
      ? (fu.demoDateTime ? new Date(fu.demoDateTime).toLocaleString() : 'Booked')
      : (fu.demoReason || 'No');

    const followDate = fu.specificFollowUpDate ? new Date(fu.specificFollowUpDate).toISOString().substring(0, 10) : '';

    const teacherOptions = teachersList || [];

    return {
      studentName: fu.studentName,
      studentMobile: fu.studentMobile,
      sclass: fu.sclassName?.sclassName || '',
      feedbackType: fu.feedbackType,
      demo: demoText,
      specificFollowUpDate: followDate,
      assignedTo: (
        <Select
          size="small"
          value={fu.assignedTo?._id || ''}
          displayEmpty
          onChange={(e) => handleAssign(fu._id, e.target.value)}
        >
          <MenuItem value=""><em>Unassigned</em></MenuItem>
          {teacherOptions.map((t) => (
            <MenuItem key={t._id} value={t._id}>{t.name}</MenuItem>
          ))}
        </Select>
      ),
      actions: (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outlined" onClick={() => handleRequestUpdate(fu._id)} disabled={fu.requestUpdate}>
            Request Update
          </Button>
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
        <div style={{ fontSize: '20px' }}>No Follow-Ups Right Now</div>
      ) : (
        <>
          <h3 style={{ fontSize: '30px', marginBottom: '40px' }}>Follow-Ups</h3>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            {Array.isArray(followupsList) && followupsList.length > 0 && (
              <TableViewTemplate columns={followupColumns} rows={followupRows} />
            )}
          </Paper>
        </>
      )}
    </div>
  );
};

export default ShowFollowUps;
