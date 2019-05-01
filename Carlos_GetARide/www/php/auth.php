require_once ../lib/limonade.php


// just an example
dispatch('/', 'hello');
        function hello()
        {
            return 'Hello world!';
        }
run();