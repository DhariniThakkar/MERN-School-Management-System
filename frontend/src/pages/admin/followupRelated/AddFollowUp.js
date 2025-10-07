import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createFollowup } from '../../../redux/followupRelated/followupHandle';
import { resetStatus } from '../../../redux/followupRelated/followupSlice';
import { CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Popup from '../../../components/Popup';

const AddFollowUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.followup);

  const [studentName, setStudentName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [studentMobile, setStudentMobile] = useState('');
  const [sclassName, setSclassName] = useState('');
  const [feedbackType, setFeedbackType] = useState('Positive');
  const [demoBooked, setDemoBooked] = useState(false);
  const [demoDateTime, setDemoDateTime] = useState('');
  const [demoReason, setDemoReason] = useState('');
  const [specificFollowUpDate, setSpecificFollowUpDate] = useState('');

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState('');

  const adminID = currentUser._id;

  const submitHandler = (e) => {
    e.preventDefault();
    setLoader(true);

    const fields = {
      studentName,
      motherName,
      fatherName,
      studentMobile,
      sclassName,
      adminID,
      feedbackType,
      demoBooked,
      demoDateTime: demoBooked ? demoDateTime : undefined,
      demoReason: !demoBooked ? demoReason : undefined,
      specificFollowUpDate,
    };

    dispatch(createFollowup(fields));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/followups');
      dispatch(resetStatus());
    } else if (status === 'error') {
      setMessage('Network Error');
      setShowPopup(true);
      setLoader(false);
      dispatch(resetStatus());
    } else if (status === 'failed') {
      setMessage('Validation failed');
      setShowPopup(true);
      setLoader(false);
      dispatch(resetStatus());
    }
  }, [status, navigate, dispatch]);

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Follow-Up</span>

          <label>Student Name</label>
          <input className="registerInput" type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} required />

          <label>Mother Name</label>
          <input className="registerInput" type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} />

          <label>Father Name</label>
          <input className="registerInput" type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />

          <label>Student Mobile</label>
          <input className="registerInput" type="tel" value={studentMobile} onChange={(e) => setStudentMobile(e.target.value)} required />

          <label>Standard/Class ID</label>
          <input className="registerInput" type="text" value={sclassName} onChange={(e) => setSclassName(e.target.value)} required />

          <label>School</label>
          <input className="registerInput" type="text" value={currentUser.schoolName} disabled />

          <label>Feedback</label>
          <RadioGroup row value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
            <FormControlLabel value="Positive" control={<Radio />} label="Positive" />
            <FormControlLabel value="Negative" control={<Radio />} label="Negative" />
          </RadioGroup>

          <label>Demo Booked?</label>
          <RadioGroup row value={demoBooked ? 'Yes' : 'No'} onChange={(e) => setDemoBooked(e.target.value === 'Yes')}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>

          {demoBooked ? (
            <>
              <label>Demo Date & Time</label>
              <input className="registerInput" type="datetime-local" value={demoDateTime} onChange={(e) => setDemoDateTime(e.target.value)} required />
            </>
          ) : (
            <>
              <label>Reason</label>
              <input className="registerInput" type="text" value={demoReason} onChange={(e) => setDemoReason(e.target.value)} required />
            </>
          )}

          <label>Specific Follow-Up Date</label>
          <input className="registerInput" type="date" value={specificFollowUpDate} onChange={(e) => setSpecificFollowUpDate(e.target.value)} required />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : 'Add'}
          </button>
        </form>
      </div>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </>
  );
};

export default AddFollowUp;
