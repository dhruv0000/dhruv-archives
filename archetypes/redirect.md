---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
url: ""  # Target URL to redirect to
draft: true
layout: redirect  # Requires a redirect layout template
description: ""  # Optional description for SEO
aliases: []  # Optional URL aliases
permanent: true  # Whether this is a permanent (301) or temporary (302) redirect
weight: 0  # Optional ordering weight
---

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=https://docs.google.com/document/d/1fJJo3oNB5uM001wyZwGufoIH_EVlie4qRM4k5MXXNL0/edit?usp=sharing">
    <title>Redirecting to Resume</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
            background-color: #FAF8F1;
        }
        .container {
            text-align: center;
            padding: 2rem;
        }
        h1 {
            margin-bottom: 1rem;
        }
        p {
            margin-bottom: 2rem;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 0.75rem;
            font-weight: 500;
            transition: transform 0.1s ease;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .btn:active {
            transform: scale(0.95);
        }
        .dark .btn {
            background-color: #fff;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Redirecting to Resume</h1>
        <p>If you are not redirected automatically, click the link below:</p>
        <a class="btn" href="https://docs.google.com/document/d/1fJJo3oNB5uM001wyZwGufoIH_EVlie4qRM4k5MXXNL0/edit?usp=sharing">View Resume</a>
    </div>
    <script>
        // Redirect to the resume
        window.location.href = "https://docs.google.com/document/d/1fJJo3oNB5uM001wyZwGufoIH_EVlie4qRM4k5MXXNL0/edit?usp=sharing";
    </script>
</body>
</html>
