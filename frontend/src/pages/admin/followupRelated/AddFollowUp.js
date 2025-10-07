import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFollowup } from '../../../redux/followupRelated/followupHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Popup from '../../../components/Popup';
import { resetStatus } from '../../../redux/followupRelated/followupSlice';

const AddFollowUp = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const followupState = useSelector(state => state.followup);
  const { sclassesList } = useSelector(state => state.sclass);

  const [studentName, setStudentName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [standard, setStandard] = useState('');
  const [feedback, setFeedback] = useState('Positive');
  const [demoBooked, setDemoBooked] = useState('No');
  const [demoDateTime, setDemoDateTime] = useState('');
  const [demoReason, setDemoReason] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass'));
  }, [dispatch, adminID]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);

    const fields = {
      studentName,
      motherName,
      fatherName,
      studentMobile,
      standard,
      feedback,
      demo: demoBooked === 'Yes' ? { booked: true, dateTime: demoDateTime } : { booked: false, reason: demoReason },
      followUpDate,
      adminID,
    };

    dispatch(createFollowup(fields));
  };

  useEffect(() => {
    if (followupState.error) {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
    } else if (followupState.status === 'added') {
      setMessage('Follow-Up created');
      setShowPopup(true);
      setLoader(false);
      dispatch(resetStatus());
      setStudentName('');
      setMotherName('');
      setFatherName('');
      setStudentMobile('');
      setStandard('');
      setFeedback('Positive');
      setDemoBooked('No');
      setDemoDateTime('');
      setDemoReason('');
      setFollowUpDate('');
    }
  }, [followupState.status, followupState.error, dispatch]);

  const standardOptions = useMemo(() => (sclassesList || []).map(c => ({ id: c._id, name: c.sclassName })), [sclassesList]);

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Follow-Up</span>

          <label>Student Name</label>
          <input className="registerInput" type="text" placeholder="Enter student name..." value={studentName} onChange={(e) => setStudentName(e.target.value)} required />

          <label>Mother Name</label>
          <input className="registerInput" type="text" placeholder="Enter mother name..." value={motherName} onChange={(e) => setMotherName(e.target.value)} />

          <label>Father Name</label>
          <input className="registerInput" type="text" placeholder="Enter father name..." value={fatherName} onChange={(e) => setFatherName(e.target.value)} />

          <label>Student Mobile</label>
          <input className="registerInput" type="tel" placeholder="Enter student mobile..." value={studentMobile} onChange={(e) => setStudentMobile(e.target.value)} pattern="[0-9]{7,15}" required />

          <label>Standard/Class</label>
          <select className="registerInput" value={standard} onChange={(e) => setStandard(e.target.value)} required>
            <option value="" disabled>Select class</option>
            {standardOptions.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
          </select>

          <label>School</label>
          <input className="registerInput" type="text" value={currentUser.schoolName} disabled />

          <label>Feedback</label>
          <RadioGroup row value={feedback} onChange={(e) => setFeedback(e.target.value)}>
            <FormControlLabel value="Positive" control={<Radio />} label="Positive" />
            <FormControlLabel value="Negative" control={<Radio />} label="Negative" />
          </RadioGroup>

          <label>Demo Booked?</label>
          <RadioGroup row value={demoBooked} onChange={(e) => setDemoBooked(e.target.value)}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {demoBooked === 'Yes' && (
            <>
              <label>Demo Date & Time</label>
              <input className="registerInput" type="datetime-local" value={demoDateTime} onChange={(e) => setDemoDateTime(e.target.value)} required />
            </>
          )}
          {demoBooked === 'No' && (
            <>
              <label>Reason</label>
              <input className="registerInput" type="text" value={demoReason} onChange={(e) => setDemoReason(e.target.value)} required />
            </>
          )}

          <label>Specific Follow-Up Date</label>
          <input className="registerInput" type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? (<CircularProgress size={24} color="inherit" />) : ('Add')}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddFollowUp;
