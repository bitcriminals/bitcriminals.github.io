{% assign collection = site.collections | where: 'label', page.collection | first%}

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{page.title}} | Bit Criminals</title>
    <link rel="icon" type="image/png" sizes="64x64" href="images/myfavicon.png">
    <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/global.css">
    <link rel="stylesheet" href="/css/post.css">
</head>
<body>
    {% include header.html %}
    <main>
        <h1>
            {{page.title}} Writeup ({{collection.title}})
        </h1>
        <time datetime="{{ page.date | date_to_xmlschema }}" class="by-line">
            {{ page.date | date_to_string }}
        </time>
        <p class="author">
            {{page.author}}
        </p>
        <p>
            <b>Type:</b> 
            {{page.type}}
        </p>
        <p>
            <b>Difficulty: </b>
            {{page.difficulty}}
        </p>
        <p>
            <b>Prompt: </b>
            {{page.prompt | newline_to_br }}
        </p>
        <h1 id="solution_start">Solution</h1>
        {{content}}
    </main>
    {% include footer.html %}
    <script src="https://kit.fontawesome.com/4e16efa13b.js" crossorigin="anonymous"></script>
    <script src="/js/global.js"></script>
</body>
</html>