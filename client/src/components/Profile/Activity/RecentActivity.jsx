import React, { useState, useEffect } from 'react';

const RecentActivity = () => {
    const [RecentActivityList, SetRecentActivityList] = useState([]);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                const response = await fetch('api/recent-activity');
                if (!response.ok) {
                    throw new Error('Failed to fetch recent activity data');
                }
                const data = await response.json();
                SetRecentActivityList(data); // Update the state with fetched data
            } catch (error) {
                console.error('Error fetching recent activity:', error);
            }
        };

        fetchRecentActivity();
    }, []);

    return (
        <div className="RecentActivity">
            <h2>Recent Activity</h2>
            <ul>
                {RecentActivityList.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivity;
