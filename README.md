# Book4U

Book4U is a streamlined facility booking system designed for non-registered campus facilities. It provides a convenient way for students to reserve spaces for group meetings, events, or projects. The project is live and accessible at [https://syal-2ae9b.firebaseapp.com/](https://syal-2ae9b.firebaseapp.com/).

## Problem

At RC4 (Residential College 4), the booking process for the Multiple Purpose Sports Hall (MPSH) was manual and required users to check a Google Sheets timetable and communicate booking details via Telegram. The process was cumbersome and depended on a yearly student representative to manually update the booking records.

## Solution

Book4U solves this problem by offering an automated booking system accessible from its homepage. Users can easily submit booking requests, and administrators can log in to review and approve submitted bookings. The approved bookings are then reflected in the timetable displayed on the homepage, creating a seamless and efficient booking experience.

## Features

Here are the key features of the Book4U booking system:

1. **Register**
   This feature allows new users to create an account within the booking system by providing a username and password. User passwords are securely stored in the database using Go's bcrypt hash function.

2. **Login**
   Users must authenticate their identities before accessing their accounts and using the booking system features. Authentication involves entering the username (or email address) and password established during the registration process.

3. **Availability Table**
   The homepage features an availability table that visually represents the current booking schedule. The table color-codes available slots in green and booked slots in red, making it easy for users to identify open time slots for booking.

4. **Booking Management**
   - Admins can view all entries from the `requestedbookings` table.
   - Users can access detailed information about each booking, including date, start time, end time, and other relevant details. This organized booking management feature assists users in planning and adjusting their schedules efficiently.

5. **Protected Routes**
   Protected routes can only be accessed with a valid JWT (JSON Web Token) access token. The frontend automatically fetches a new JWT token by calling the refreshToken endpoint every 10 minutes, ensuring continuous secure access.

6. **Validation**
   All fields in the booking form are mandatory, and error messages appear when users attempt to submit empty fields.

For more detailed information about system features, system and user testing, please refer to the [full project documentation](https://docs.google.com/document/d/1lBbl30woSB4tnFogro37Me5kaN_AsGDz815Tp-ZH0GI/edit?usp=sharing).

## Technologies Used

- Frontend: Built with ReactJS, utilizing Bootstrap and MUI (Material-UI), and hosted on Firebase.
- Backend: Developed using Go and Docker, with data stored in PostgreSQL. Hosted on Heroku.

## Motivation

As RC4 residents, we recognized the inefficiencies in the manual booking process for facilities like the Multiple Purpose Sports Hall, seminar rooms, and function rooms. Our motivation was to simplify and enhance this process for the benefit of students by creating a user-friendly and automated booking system.

## License

Book4U is released under the [MIT License](LICENSE).

---
