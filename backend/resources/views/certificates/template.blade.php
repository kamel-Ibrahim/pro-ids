<!DOCTYPE html>
<html>
<head>
    <style>
        body { text-align: center; font-family: DejaVu Sans, sans-serif; }
        h1 { font-size: 32px; }
        p { font-size: 18px; }
    </style>
</head>
<body>
    <h1>Certificate of Completion</h1>

    <p>This certifies that</p>
    <h2>{{ $student }}</h2>

    <p>has successfully completed the course</p>
    <h3>{{ $course }}</h3>

    <p>Date: {{ $date }}</p>
    <p>Instructor: {{ $instructor }}</p>

    <p><strong>Verification Code:</strong> {{ $code }}</p>
</body>
</html>