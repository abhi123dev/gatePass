import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Canvg } from 'canvg';
import 'canvas-toBlob';
import { jsPDF } from 'jspdf';
import './styles.css';

const Portal = () => {
  const navigate = useNavigate();
  const [modifiedSvg, setModifiedSvg] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const svgRef = useRef();

  const [formData, setFormData] = useState({
    Date: '',
    who: '',
    work: '',
    name: '',
    number: '',
    vehicle: '',
    equipment: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleGenerateSVG = async () => {
    try {
      // Load the SVG template
      const response = await fetch('/template.svg');
      let svgTemplate = await response.text();

      // Replace placeholders with the form input data
      svgTemplate = svgTemplate
        .replace(/_NAME_/g, formData.name)
        .replace(/_DATE_/g, formData.Date)
        .replace(/_WHO_/g, formData.who)
        .replace(/_WORK_/g, formData.work)
        .replace(/_NUMBER_/g, formData.number)
        .replace(/_VEHICLE_/g, formData.vehicle)
        .replace(/_EQUIPMENT_/g, formData.equipment);

      // Set the modified SVG to state for preview
      setModifiedSvg(svgTemplate);
    } catch (error) {
      console.error('An error occurred while modifying the SVG:', error);
      alert('An error occurred while modifying the SVG. Please try again.');
    }
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([modifiedSvg], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'VIP_Pass.svg';
    link.click();
  };

  const handleDownloadPNG = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const v = await Canvg.fromString(ctx, modifiedSvg);

      // Set canvas dimensions to match the SVG dimensions
      const svgElement = svgRef.current.querySelector('svg');
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      // Render the SVG onto the canvas
      await v.render();

      // Convert the canvas to a Blob and download it as a PNG
      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'GATE_Pass.png';
        link.click();
      }, 'image/png');
    } catch (error) {
      console.error('An error occurred while converting the SVG to PNG:', error);
      alert('An error occurred while converting the SVG to PNG. Please try again.');
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const v = await Canvg.fromString(ctx, modifiedSvg);

      // Set canvas dimensions to match the SVG dimensions
      const svgElement = svgRef.current.querySelector('svg');
      canvas.width = svgElement.width.baseVal.value;
      canvas.height = svgElement.height.baseVal.value;

      // Render the SVG onto the canvas
      await v.render();

      // Convert the canvas to a PNG
      const dataUrl = canvas.toDataURL('image/png');

      // Create a PDF and add the PNG image
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, 'PNG', 0, 0, 210, 297); // A4 size in mm

      // Generate the PDF URL and set it to state
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error('An error occurred while generating the PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };

  const handleSendMail = async () => {
    try {
      const response = await fetch('http://your-backend-url/send-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Password sent successfully!');
      } else {
        alert('Failed to send password.');
      }
    } catch (error) {
      console.error('Error sending password:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to the Portal</h1>

      <form className="form">
        <div className="input-group">
          <label htmlFor="Date">Date</label>
          <input
            type="text"
            id="Date"
            name="Date"
            value={formData.Date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="who">Who is he?* (Eg. Artist or Vendor or Sponsor)</label>
          <input
            type="text"
            id="who"
            name="who"
            value={formData.who}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="work">Purpose*</label>
          <input
            type="text"
            id="work"
            name="work"
            value={formData.work}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="name">Name of Artist/Vendor*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="number">No of people*</label>
          <input
            type="text"
            id="number"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="vehicle">Vehicle (if any)</label>
          <input
            type="text"
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="equipment">Equipment (if any)</label>
          <input
            type="text"
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleInputChange}
            required
          />
        </div>
      </form>

      <div className="button-group">
        <button type="button" onClick={handleGenerateSVG} disabled={!formData.name} className="button">
          Generate Modified SVG
        </button>

        {modifiedSvg && (
          <div>
            <div ref={svgRef} dangerouslySetInnerHTML={{ __html: modifiedSvg }} style={{ display: 'none' }} />
            <button onClick={handleDownloadSVG} className="button">Download Modified SVG</button>
            <button onClick={handleDownloadPNG} className="button">Download as PNG</button>
            <button onClick={handleGeneratePDF} className="button">Generate PDF</button>
            <button onClick={handleSendMail} className="button">Send Pass on Mail</button>
          </div>
        )}

        {pdfUrl && (
          <div>
            <h2>Generated PDF</h2>
            <iframe src={pdfUrl} width="100%" height="600px" />
          </div>
        )}
        <button onClick={handleLogout} className="button">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Portal;




