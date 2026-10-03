// Database Simulation to track double booking
const bookedSlots = {};

// Classrooms inventory
const roomList = [
    { name: "DS-Lab 01 (Computer Lab)", capacity: 60, projector: true, lab: true },
    { name: "Smart Hall 101", capacity: 40, projector: true, lab: false },
    { name: "Lecture Hall 201", capacity: 80, projector: false, lab: false },
    { name: "Auditorium A", capacity: 150, projector: true, lab: false }
];

document.getElementById('classForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const className = document.getElementById('className').value;
    const students = parseInt(document.getElementById('students').value);
    const timeSlot = document.getElementById('timeSlot').value;
    const reqProjector = document.getElementById('reqProjector').checked;
    const reqLab = document.getElementById('reqLab').checked;
    const output = document.getElementById('output');

    // 1. Double Booking Check
    const bookingKey = `${timeSlot}`;
    
    // Find Suitable Room based on logic
    let allocatedRoom = null;

    for (let room of roomList) {
        if (room.capacity >= students) {
            if (reqLab && !room.lab) continue;
            if (reqProjector && !room.projector) continue;

            // Check availability
            if (!bookedSlots[bookingKey] || bookedSlots[bookingKey] !== room.name) {
                allocatedRoom = room.name;
                bookedSlots[bookingKey] = room.name; // Book room
                break;
            }
        }
    }

    if (allocatedRoom) {
        output.innerHTML = `
            <strong>Class:</strong> ${className}<br>
            <strong>Time Slot:</strong> ${timeSlot}<br>
            <strong>Allocated Venue:</strong> ${allocatedRoom}<br>
            <strong>Status:</strong> <span style="color:green; font-weight:bold;">Successfully Allocated!</span>
        `;
        output.style.background = '#d4edda';
        output.style.color = '#155724';

        // Update Chart Analytics
        updateChart();
    } else {
        output.innerHTML = `
            <strong>Status:</strong> <span style="color:red; font-weight:bold;">Allocation Failed!</span><br>
            No room matches your criteria or the suitable room is already booked for this slot (${timeSlot}).
        `;
        output.style.background = '#f8d7da';
        output.style.color = '#721c24';
    }
});

// Chart.js - Analytics Visualization
let chartInstance = null;

function updateChart() {
    const ctx = document.getElementById('usageChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DS-Lab 01', 'Smart Hall 101', 'Lecture Hall 201', 'Auditorium A'],
            datasets: [{
                label: 'Room Allocation Frequency',
                data: [3, 5, 2, 4], // Sample Analytics Data
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Initial Chart Load
window.onload = updateChart;
