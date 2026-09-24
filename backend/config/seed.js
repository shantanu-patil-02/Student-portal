import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const seedSampleData = async () => {
  try {
    // 1. Ensure primary demo account Shantanu@student.edu exists with password123
    let demoUser = await User.findOne({ email: 'alex@student.edu' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Shantanu patil',
        email: 'alex@student.edu',
        password: 'password123',
      });
      console.log('[Database] Seeded Shantanu@student.edu / password123');
    } else {
      // Ensure password matches password123 in case it was modified or corrupted
      const isMatch = await demoUser.matchPassword('password123');
      if (!isMatch) {
        demoUser.password = 'password123';
        await demoUser.save();
        console.log('[Database] Synchronized password for Shantanu@student.edu');
      }
    }

    // 2. Also ensure demo@student.com exists with Student@123 as requested in assignment spec
    let altDemoUser = await User.findOne({ email: 'demo@student.com' });
    if (!altDemoUser) {
      altDemoUser = await User.create({
        name: 'Shantanu patil',
        email: 'demo@student.com',
        password: 'Student@123',
      });
      console.log('[Database] Seeded demo@student.com / Student@123');
    } else {
      const isMatch = await altDemoUser.matchPassword('Student@123');
      if (!isMatch) {
        altDemoUser.password = 'Student@123';
        await altDemoUser.save();
      }
    }

    // 3. Ensure sample tasks exist for demoUser
    const taskCount = await Task.countDocuments({ user: demoUser._id });
    if (taskCount === 0) {
      const today = new Date();
      const inDays = (days) => {
        const d = new Date(today);
        d.setDate(d.getDate() + days);
        return d;
      };

      await Task.create([
        {
          title: 'Calculus III Problem Set 4',
          description: 'Complete questions 1 to 15 on double integrals and surface area calculations from chapter 14.',
          subject: 'Mathematics',
          priority: 'High',
          status: 'Pending',
          dueDate: inDays(2),
          user: demoUser._id,
        },
        {
          title: 'Operating Systems Scheduling Lab',
          description: 'Implement Shortest Job First (SJF) and Round Robin CPU scheduling simulation in C.',
          subject: 'Computer Science',
          priority: 'High',
          status: 'In Progress',
          dueDate: inDays(4),
          user: demoUser._id,
        },
        {
          title: 'Physics Optics Lab Report',
          description: 'Write up observations and diffraction grating calculations from Thursday lab session.',
          subject: 'Physics',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: inDays(6),
          user: demoUser._id,
        },
        {
          title: 'Software Engineering Sprint Review',
          description: 'Prepare slide deck for sprint 2 demo showcasing student task manager architecture.',
          subject: 'Software Engineering',
          priority: 'Medium',
          status: 'Pending',
          dueDate: inDays(9),
          user: demoUser._id,
        },
        {
          title: 'Academic Writing Annotated Bibliography',
          description: 'Submit 5 peer-reviewed sources on DevOps adoption in university curricula.',
          subject: 'Technical Writing',
          priority: 'Low',
          status: 'Completed',
          dueDate: inDays(-2),
          user: demoUser._id,
        },
      ]);
      console.log('[Database] Sample student tasks seeded successfully.');
    }
  } catch (error) {
    console.warn('[Database Seed Warning]', error.message);
  }
};
