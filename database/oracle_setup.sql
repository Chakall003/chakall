-- ============================================================================
-- CHAKALL - EVENT & SONG MANAGER
-- Script SQL para Oracle Database
-- ============================================================================

-- Crear las tablas principales
-- ============================================================================

-- Tabla de Canciones
CREATE TABLE songs (
    id NUMBER PRIMARY KEY,
    title VARCHAR2(200) NOT NULL,
    type_code VARCHAR2(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Eventos
CREATE TABLE events (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    event_date DATE NOT NULL,
    venue_id NUMBER NOT NULL,
    package_code VARCHAR2(50) NOT NULL,
    theme_code VARCHAR2(50) NOT NULL,
    client_number NUMBER NOT NULL,
    song_id NUMBER,
    song_title VARCHAR2(200),
    type_code VARCHAR2(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_songs FOREIGN KEY (song_id) REFERENCES songs(id)
);

-- Tablas auxiliares
CREATE TABLE venues (
    id NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    address VARCHAR2(500),
    capacity NUMBER
);

CREATE TABLE clients (
    client_number NUMBER PRIMARY KEY,
    name VARCHAR2(200) NOT NULL,
    email VARCHAR2(100),
    phone VARCHAR2(50)
);

-- Crear secuencias para IDs auto-incrementales
-- ============================================================================
CREATE SEQUENCE seq_events START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_songs START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_venues START WITH 1 INCREMENT BY 1;

-- Crear triggers para actualización automática de fechas
-- ============================================================================
CREATE OR REPLACE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

CREATE OR REPLACE TRIGGER trg_songs_updated_at
    BEFORE UPDATE ON songs
    FOR EACH ROW
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Crear el paquete para gestión de eventos
-- ============================================================================
CREATE OR REPLACE PACKAGE PKG_EVENTS AS
    -- Procedimiento para crear evento
    PROCEDURE CREATE_EVENT(
        p_event_id IN NUMBER,
        p_event_name IN VARCHAR2,
        p_event_date IN VARCHAR2,
        p_venue_id IN NUMBER,
        p_package_code IN VARCHAR2,
        p_theme_code IN VARCHAR2,
        p_client_number IN NUMBER,
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    );
    
    -- Procedimiento para actualizar evento
    PROCEDURE UPDATE_EVENT(
        p_event_id IN NUMBER,
        p_event_name IN VARCHAR2,
        p_event_date IN VARCHAR2,
        p_venue_id IN NUMBER,
        p_package_code IN VARCHAR2,
        p_theme_code IN VARCHAR2,
        p_client_number IN NUMBER,
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    );
    
    -- Procedimiento para obtener todos los eventos
    PROCEDURE GET_ALL_EVENTS(
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para eliminar evento
    PROCEDURE DELETE_EVENT(
        p_event_id IN NUMBER
    );
END PKG_EVENTS;
/

-- Implementación del paquete de eventos
-- ============================================================================
CREATE OR REPLACE PACKAGE BODY PKG_EVENTS AS

    PROCEDURE CREATE_EVENT(
        p_event_id IN NUMBER,
        p_event_name IN VARCHAR2,
        p_event_date IN VARCHAR2,
        p_venue_id IN NUMBER,
        p_package_code IN VARCHAR2,
        p_theme_code IN VARCHAR2,
        p_client_number IN NUMBER,
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    ) AS
    BEGIN
        INSERT INTO events (
            id, name, event_date, venue_id, package_code, theme_code,
            client_number, song_id, song_title, type_code
        ) VALUES (
            p_event_id, p_event_name, TO_DATE(p_event_date, 'YYYY-MM-DD'),
            p_venue_id, p_package_code, p_theme_code,
            p_client_number, p_song_id, p_song_title, p_type_code
        );
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Evento creado exitosamente: ' || p_event_name);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20001, 'Error al crear evento: ' || SQLERRM);
    END CREATE_EVENT;

    PROCEDURE UPDATE_EVENT(
        p_event_id IN NUMBER,
        p_event_name IN VARCHAR2,
        p_event_date IN VARCHAR2,
        p_venue_id IN NUMBER,
        p_package_code IN VARCHAR2,
        p_theme_code IN VARCHAR2,
        p_client_number IN NUMBER,
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    ) AS
    BEGIN
        UPDATE events SET
            name = p_event_name,
            event_date = TO_DATE(p_event_date, 'YYYY-MM-DD'),
            venue_id = p_venue_id,
            package_code = p_package_code,
            theme_code = p_theme_code,
            client_number = p_client_number,
            song_id = p_song_id,
            song_title = p_song_title,
            type_code = p_type_code
        WHERE id = p_event_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20002, 'Evento no encontrado con ID: ' || p_event_id);
        END IF;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Evento actualizado exitosamente: ' || p_event_name);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20003, 'Error al actualizar evento: ' || SQLERRM);
    END UPDATE_EVENT;

    PROCEDURE GET_ALL_EVENTS(
        p_cursor OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                e.id,
                e.name,
                TO_CHAR(e.event_date, 'YYYY-MM-DD') as event_date,
                e.venue_id,
                e.package_code,
                e.theme_code,
                e.client_number,
                e.song_id,
                e.song_title,
                e.type_code,
                e.created_at,
                e.updated_at
            FROM events e
            ORDER BY e.event_date DESC;
    END GET_ALL_EVENTS;

    PROCEDURE DELETE_EVENT(
        p_event_id IN NUMBER
    ) AS
    BEGIN
        DELETE FROM events WHERE id = p_event_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20004, 'Evento no encontrado con ID: ' || p_event_id);
        END IF;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Evento eliminado exitosamente: ' || p_event_id);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20005, 'Error al eliminar evento: ' || SQLERRM);
    END DELETE_EVENT;

END PKG_EVENTS;
/

-- Crear el paquete para gestión de canciones
-- ============================================================================
CREATE OR REPLACE PACKAGE PKG_SONGS AS
    -- Procedimiento para crear canción
    PROCEDURE CREATE_SONG(
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    );
    
    -- Procedimiento para actualizar canción
    PROCEDURE UPDATE_SONG(
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    );
    
    -- Procedimiento para obtener todas las canciones
    PROCEDURE GET_ALL_SONGS(
        p_cursor OUT SYS_REFCURSOR
    );
    
    -- Procedimiento para eliminar canción
    PROCEDURE DELETE_SONG(
        p_song_id IN NUMBER
    );
END PKG_SONGS;
/

-- Implementación del paquete de canciones
-- ============================================================================
CREATE OR REPLACE PACKAGE BODY PKG_SONGS AS

    PROCEDURE CREATE_SONG(
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    ) AS
    BEGIN
        INSERT INTO songs (id, title, type_code)
        VALUES (p_song_id, p_song_title, p_type_code);
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Canción creada exitosamente: ' || p_song_title);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20006, 'Error al crear canción: ' || SQLERRM);
    END CREATE_SONG;

    PROCEDURE UPDATE_SONG(
        p_song_id IN NUMBER,
        p_song_title IN VARCHAR2,
        p_type_code IN VARCHAR2
    ) AS
    BEGIN
        UPDATE songs SET
            title = p_song_title,
            type_code = p_type_code
        WHERE id = p_song_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20007, 'Canción no encontrada con ID: ' || p_song_id);
        END IF;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Canción actualizada exitosamente: ' || p_song_title);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20008, 'Error al actualizar canción: ' || SQLERRM);
    END UPDATE_SONG;

    PROCEDURE GET_ALL_SONGS(
        p_cursor OUT SYS_REFCURSOR
    ) AS
    BEGIN
        OPEN p_cursor FOR
            SELECT 
                id,
                title,
                type_code,
                created_at,
                updated_at
            FROM songs
            ORDER BY title ASC;
    END GET_ALL_SONGS;

    PROCEDURE DELETE_SONG(
        p_song_id IN NUMBER
    ) AS
    BEGIN
        DELETE FROM songs WHERE id = p_song_id;
        
        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20009, 'Canción no encontrada con ID: ' || p_song_id);
        END IF;
        
        COMMIT;
        
        DBMS_OUTPUT.PUT_LINE('Canción eliminada exitosamente: ' || p_song_id);
    EXCEPTION
        WHEN OTHERS THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20010, 'Error al eliminar canción: ' || SQLERRM);
    END DELETE_SONG;

END PKG_SONGS;
/

-- Insertar datos de prueba
-- ============================================================================

-- Canciones de ejemplo
INSERT INTO songs (id, title, type_code) VALUES (201, 'Perfect', 'ROMANTIC');
INSERT INTO songs (id, title, type_code) VALUES (202, 'Celebration', 'PARTY');
INSERT INTO songs (id, title, type_code) VALUES (203, 'Canon in D', 'CLASSICAL');
INSERT INTO songs (id, title, type_code) VALUES (204, 'Happy', 'UPBEAT');

-- Venues de ejemplo
INSERT INTO venues (id, name, address, capacity) VALUES (101, 'Salón Primavera', 'Av. Principal 123', 150);
INSERT INTO venues (id, name, address, capacity) VALUES (102, 'Centro de Convenciones', 'Calle Comercio 456', 300);

-- Clientes de ejemplo
INSERT INTO clients (client_number, name, email, phone) VALUES (1001, 'María García', 'maria@email.com', '555-0101');
INSERT INTO clients (client_number, name, email, phone) VALUES (1002, 'Juan Pérez', 'juan@email.com', '555-0102');

-- Eventos de ejemplo
INSERT INTO events (id, name, event_date, venue_id, package_code, theme_code, client_number, song_id, song_title, type_code)
VALUES (1, 'Boda de Primavera', DATE '2024-05-15', 101, 'PREMIUM', 'SPRING', 1001, 201, 'Perfect', 'ROMANTIC');

INSERT INTO events (id, name, event_date, venue_id, package_code, theme_code, client_number, song_id, song_title, type_code)
VALUES (2, 'Cumpleaños Corporativo', DATE '2024-06-20', 102, 'STANDARD', 'CORPORATE', 1002, 202, 'Celebration', 'PARTY');

COMMIT;

-- Mostrar resumen
SELECT 'Tablas creadas exitosamente' as status FROM dual;
SELECT COUNT(*) as total_songs FROM songs;
SELECT COUNT(*) as total_events FROM events;
SELECT COUNT(*) as total_venues FROM venues;
SELECT COUNT(*) as total_clients FROM clients;
