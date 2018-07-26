<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'blocks_db');

/** MySQL database username */
define('DB_USER', 'blocks_db');

/** MySQL database password */
define('DB_PASSWORD', 'bandit123');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'D>~QoKSD+dV%Ml0ItC/|jK<QP|wvF}F/p1AhS1NcS)Q+a;O]01%vetSUuj8T50wg');
define('SECURE_AUTH_KEY',  'E~s,@@^M?Qp%5SX~P|.K.Q4 ZW}/4Yh<q2$.X^C?Fgt&le7L[1PuN[6sQ28rZ*%D');
define('LOGGED_IN_KEY',    'pB*mDPz$U_|OHx+[bg5C)h3kIT46 H-%g1xV}9aRSawp8#;3{>-dq!{}}kH9F}hl');
define('NONCE_KEY',        'J3s`!XARrcIFZA${ _[;#js8,9I/HD!5V-ml}Ev^H-a~R}EM$(CEtzd0si7sMAfG');
define('AUTH_SALT',        '-T06YEmDS6tNSGG#}lJy(zX#Te%OO0jwL`#PF6,qda:^FWeM4qypAERX[QAZ>a2g');
define('SECURE_AUTH_SALT', 'KiiT;w>0_(@)eH|5w+T43V1?aj>}0tUhd{^x!7rb:>#GWTBS6;W&LlYIE9)Ey,|A');
define('LOGGED_IN_SALT',   '3Z=Mrc>o)_nNt,!Bg7QMO5M:=}_dD5GL0?&oe:oV(>kfhetIEJoAtC<MoWvm%5rk');
define('NONCE_SALT',       'K6efSSENsCiYhM][Bu,+p+([A>S%{?qkz0)SN>fg&S6R>P_ }BfF,(nWA7jdN}l/');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
