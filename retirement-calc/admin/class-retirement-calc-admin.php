<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    retirement_calc
 * @subpackage retirement_calc/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    retirement_calc
 * @subpackage retirement_calc/admin
 * @author     Your Name <email@example.com>
 */
class retirement_calc_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $retirement_calc    The ID of this plugin.
	 */
	private $retirement_calc;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $retirement_calc       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $retirement_calc, $version ) {

		$this->retirement_calc = $retirement_calc;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in retirement_calc_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The retirement_calc_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->retirement_calc, plugin_dir_url( __FILE__ ) . 'css/retirement-calc-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in retirement_calc_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The retirement_calc_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->retirement_calc, plugin_dir_url( __FILE__ ) . 'js/retirement-calc-admin.js', array( 'jquery' ), $this->version, false );

	}

}
