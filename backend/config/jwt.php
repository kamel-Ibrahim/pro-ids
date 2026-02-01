<?php

return [

    'secret' => env('JWT_SECRET'),

    'ttl' => 60 * 24,

    'refresh_ttl' => 60 * 24 * 7,

    'algo' => 'HS256',

    'required_claims' => [
        'iss',
        'iat',
        'exp',
        'nbf',
        'sub',
        'jti',
    ],

    'persistent_claims' => [],

    'lock_subject' => true,

    'leeway' => 0,

    'blacklist_enabled' => true,

    'blacklist_grace_period' => 0,

    'decrypt_cookies' => false,

];