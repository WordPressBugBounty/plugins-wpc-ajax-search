<?php
defined( 'ABSPATH' ) || exit;

register_activation_hook( defined( 'WPCAS_LITE' ) ? WPCAS_LITE : WPCAS_FILE, 'wpcas_activate' );
register_deactivation_hook( defined( 'WPCAS_LITE' ) ? WPCAS_LITE : WPCAS_FILE, 'wpcas_deactivate' );
add_action( 'admin_init', 'wpcas_check_version' );

function wpcas_check_version() {
	if ( ! empty( get_option( 'wpcas_version' ) ) && ( get_option( 'wpcas_version' ) < WPCAS_VERSION ) ) {
		wpc_log( 'wpcas', 'upgraded' );
		update_option( 'wpcas_version', WPCAS_VERSION, false );
	}
}

function wpcas_activate() {
	wpc_log( 'wpcas', 'installed' );
	update_option( 'wpcas_version', WPCAS_VERSION, false );
}

function wpcas_deactivate() {
	wpc_log( 'wpcas', 'deactivated' );
}

if ( ! function_exists( 'wpc_log' ) ) {
	function wpc_log( $prefix, $action ) {
		$logs = get_option( 'wpc_logs', [] );
		$user = wp_get_current_user();

		if ( ! isset( $logs[ $prefix ] ) ) {
			$logs[ $prefix ] = [];
		}

		$logs[ $prefix ][] = [
			'time'   => current_time( 'mysql' ),
			'user'   => $user->display_name . ' (ID: ' . $user->ID . ')',
			'action' => $action
		];

		update_option( 'wpc_logs', $logs, false );
	}
}