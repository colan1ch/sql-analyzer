fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .setup(|_app| {  // добавил _ перед app
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}