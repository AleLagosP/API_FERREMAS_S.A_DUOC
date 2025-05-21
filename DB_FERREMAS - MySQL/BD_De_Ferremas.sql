-- Base de datos: BD_FERREMAS.
-- Tabla de Clientes:
CREATE TABLE CLIENTES (
    ID_CLIENTE INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE VARCHAR(100) NOT NULL,
    DOMICILIO VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Productos:
CREATE TABLE PRODUCTOS (
    COD_PRODUCTO INT AUTO_INCREMENT PRIMARY KEY,
    NOMBRE_PRODUCTO VARCHAR(100) NOT NULL,
    STOCK INT NOT NULL,
    PRECIO DECIMAL(10, 2) NOT NULL,
    DESCRIPCION VARCHAR(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Ventas:
CREATE TABLE VENTAS (
    COD_VENTA INT AUTO_INCREMENT PRIMARY KEY,
    ID_CLIENTE INT NOT NULL,
    TIPO_ENTREGA VARCHAR(50),
    FECHA_VENTA DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTES(ID_CLIENTE)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Detalle de Ventas:
CREATE TABLE DETALLE_VENTA (
    ID_DETALLE INT AUTO_INCREMENT PRIMARY KEY,
    COD_VENTA INT NOT NULL,
    COD_PRODUCTO INT NOT NULL,
    CANTIDAD INT NOT NULL,
    PRECIO_UNITARIO DECIMAL(10, 2) NOT NULL,
	TOTAL_PRODUCTO DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (COD_VENTA) REFERENCES VENTAS(COD_VENTA),
    FOREIGN KEY (COD_PRODUCTO) REFERENCES PRODUCTOS(COD_PRODUCTO)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Llenado de tablas:
-- Clientes
INSERT INTO CLIENTES (NOMBRE, DOMICILIO) VALUES 
('Juan Pérez', 'Av. Las Condes 1234, Santiago'),
('María González', 'Calle San Diego 456, Santiago'),
('Carlos Muñoz', 'Pasaje La Paz 789, Viña del Mar'),
('Ana Torres', 'Av. Alemania 1122, Temuco'),
('Javier Soto', 'Calle O''Higgins 334, Rancagua'),
('Lucía Rojas', 'Camino Real 555, La Serena'),
('Martín Vera', 'Av. Kennedy 777, Santiago'),
('Sofía Díaz', 'Calle Lota 900, Antofagasta'),
('Diego Fuentes', 'Av. Balmaceda 321, Coquimbo'),
('Valentina Castro', 'Pasaje Sur 111, Talca'),
('Pedro Ramírez', 'Calle Norte 456, Chillán'),
('Camila Morales', 'Av. Costanera 888, Puerto Montt'),
('Felipe Bravo', 'Camino Interior 123, Osorno'),
('Daniela Reyes', 'Calle Nueva 234, Iquique'),
('Ricardo Salinas', 'Av. Matta 345, Santiago'),
('Isidora Paredes', 'Calle Carrera 567, Arica'),
('Tomás Navarro', 'Camino del Valle 654, Concepción'),
('Josefa Méndez', 'Av. Providencia 234, Santiago'),
('Benjamín Cárdenas', 'Calle Victoria 789, Rancagua'),
('Trinidad Herrera', 'Pasaje Central 321, Viña del Mar'),
('Nicolás Araya', 'Av. España 678, Talcahuano'),
('Florencia Carrasco', 'Calle Arauco 213, Puerto Varas'),
('Cristóbal Palma', 'Av. Pajaritos 999, Maipú'),
('Renata Lagos', 'Calle Copiapó 456, Copiapó'),
('Agustín Escobar', 'Camino Marítimo 654, La Serena'),
('Emilia Peña', 'Calle Sur Poniente 122, Temuco'),
('Vicente Figueroa', 'Av. Los Leones 321, Santiago'),
('Antonia Leiva', 'Pasaje Jardines 432, Quillota'),
('Gabriel Valdés', 'Calle Oriente 200, Punta Arenas'),
('Constanza Silva', 'Av. Independencia 1010, Santiago'),
('Matías Cáceres', 'Calle Estación 678, San Antonio'),
('Fernanda Núñez', 'Av. Circunvalación 456, Arica'),
('Leandro Olivares', 'Camino Rural 345, Linares'),
('Josefina Riquelme', 'Calle Centro 234, Valparaíso'),
('Maximiliano Tapia', 'Av. Central 543, Calama'),
('Amanda Aguirre', 'Calle Norte Sur 211, Quillón'),
('Sebastián Lara', 'Pasaje Los Aromos 123, Talagante'),
('Catalina Orellana', 'Av. Austral 777, Coyhaique');

-- Productos
INSERT INTO PRODUCTOS (NOMBRE_PRODUCTO, STOCK, PRECIO, DESCRIPCION) VALUES
('Martillo', 50, 4990, 'Martillo de acero con mango de goma antideslizante'),
('Alicate', 40, 3990, 'Alicate universal de 6 pulgadas, acero forjado'),
('Destornillador plano', 60, 1990, 'Destornillador punta plana, mango ergonómico'),
('Destornillador cruz', 55, 2190, 'Destornillador punta cruz, resistente'),
('Llave inglesa', 30, 5490, 'Llave ajustable de 10 pulgadas, acero cromado'),
('Serrucho', 25, 6990, 'Serrucho manual para madera, hoja de acero templado'),
('Taladro eléctrico', 15, 34990, 'Taladro eléctrico 650W, incluye brocas'),
('Caja de clavos', 100, 2990, 'Caja con 500 clavos de 2 pulgadas'),
('Caja de tornillos', 90, 3190, 'Caja con 300 tornillos mixtos'),
('Nivel', 20, 4590, 'Nivel de burbuja de 30 cm, alta precisión'),
('Flexómetro', 35, 2790, 'Cinta métrica de 5 metros, bloqueo automático'),
('Cautín', 18, 8990, 'Cautín eléctrico 60W para soldadura'),
('Pistola de silicona', 22, 5990, 'Pistola para silicona caliente, incluye 2 barras'),
('Brocas mixtas', 45, 4990, 'Set de 10 brocas para metal, madera y concreto'),
('Lima metálica', 28, 2590, 'Lima plana para metal, mango plástico'),
('Guantes de trabajo', 60, 1990, 'Par de guantes de cuero y lona reforzada'),
('Lentes de seguridad', 50, 1890, 'Lentes transparentes anti-impacto'),
('Disco de corte', 40, 2790, 'Disco para esmeril angular, 115mm'),
('Candado', 33, 3690, 'Candado de acero templado con 2 llaves'),
('Escalera aluminio', 10, 45990, 'Escalera plegable de 5 peldaños, ligera y resistente');

-- Ventas
INSERT INTO VENTAS (ID_CLIENTE, TIPO_ENTREGA) VALUES
(1, 'Retiro en tienda'),
(2, 'Despacho a domicilio'),
(3, 'Retiro en tienda'),
(4, 'Despacho a domicilio'),
(5, 'Retiro en tienda'),
(6, 'Despacho a domicilio'),
(7, 'Retiro en tienda'),
(8, 'Despacho a domicilio'),
(9, 'Retiro en tienda'),
(10, 'Despacho a domicilio'),
(11, 'Retiro en tienda'),
(12, 'Despacho a domicilio'),
(13, 'Retiro en tienda'),
(14, 'Despacho a domicilio'),
(15, 'Retiro en tienda'),
(16, 'Despacho a domicilio'),
(17, 'Retiro en tienda'),
(18, 'Despacho a domicilio'),
(19, 'Retiro en tienda'),
(20, 'Despacho a domicilio'),
(21, 'Retiro en tienda'),
(22, 'Despacho a domicilio'),
(23, 'Retiro en tienda'),
(24, 'Despacho a domicilio'),
(25, 'Retiro en tienda'),
(26, 'Despacho a domicilio'),
(27, 'Retiro en tienda'),
(28, 'Despacho a domicilio'),
(29, 'Retiro en tienda'),
(30, 'Despacho a domicilio'),
(31, 'Retiro en tienda'),
(32, 'Despacho a domicilio'),
(33, 'Retiro en tienda'),
(34, 'Despacho a domicilio'),
(35, 'Retiro en tienda'),
(36, 'Despacho a domicilio'),
(37, 'Retiro en tienda'),
(38, 'Despacho a domicilio'),
(22, 'Retiro en tienda'),
(33, 'Despacho a domicilio'),
(7, 'Retiro en tienda'),
(13, 'Despacho a domicilio'),
(21, 'Retiro en tienda'),
(28, 'Despacho a domicilio'),
(2, 'Retiro en tienda'),
(35, 'Despacho a domicilio'),
(9, 'Retiro en tienda'),
(14, 'Despacho a domicilio'),
(27, 'Retiro en tienda'),
(12, 'Despacho a domicilio');


-- detalle_venta 
INSERT INTO DETALLE_VENTA (COD_VENTA, COD_PRODUCTO, CANTIDAD, PRECIO_UNITARIO, TOTAL_PRODUCTO)
SELECT 
    vta.COD_VENTA,
    vta.COD_PRODUCTO,
    vta.CANTIDAD,
    p.PRECIO,
    p.PRECIO * vta.CANTIDAD
FROM (
    SELECT 1 COD_VENTA, 1 COD_PRODUCTO, 2 CANTIDAD UNION ALL
    SELECT 2, 3, 1 UNION ALL
    SELECT 3, 2, 3 UNION ALL
    SELECT 3, 4, 1 UNION ALL
    SELECT 4, 5, 1 UNION ALL
    SELECT 5, 6, 2 UNION ALL
    SELECT 6, 7, 1 UNION ALL
    SELECT 7, 8, 4 UNION ALL
    SELECT 8, 9, 3 UNION ALL
    SELECT 8, 10, 1 UNION ALL
    SELECT 9, 11, 1 UNION ALL
    SELECT 10, 12, 2 UNION ALL
    SELECT 11, 13, 2 UNION ALL
    SELECT 12, 14, 1 UNION ALL
    SELECT 12, 15, 3 UNION ALL
    SELECT 13, 16, 1 UNION ALL
    SELECT 13, 17, 2 UNION ALL
    SELECT 14, 18, 1 UNION ALL
    SELECT 15, 19, 2 UNION ALL
    SELECT 16, 20, 3 UNION ALL
    SELECT 17, 5, 1 UNION ALL
    SELECT 17, 6, 2 UNION ALL
    SELECT 18, 7, 3 UNION ALL
    SELECT 19, 8, 5 UNION ALL
    SELECT 20, 9, 1 UNION ALL
    SELECT 21, 10, 2 UNION ALL
    SELECT 21, 11, 1 UNION ALL
    SELECT 22, 12, 3 UNION ALL
    SELECT 23, 13, 1 UNION ALL
    SELECT 23, 14, 2 UNION ALL
    SELECT 25, 16, 1 UNION ALL
    SELECT 26, 17, 2 UNION ALL
    SELECT 27, 18, 1 UNION ALL
    SELECT 28, 19, 2 UNION ALL
    SELECT 29, 20, 3 UNION ALL
    SELECT 30, 5, 1 UNION ALL
    SELECT 30, 6, 2 UNION ALL
    SELECT 31, 1, 2 UNION ALL
    SELECT 32, 3, 1 UNION ALL
    SELECT 32, 4, 1 UNION ALL
    SELECT 33, 5, 2 UNION ALL
    SELECT 34, 6, 1 UNION ALL
    SELECT 35, 7, 3 UNION ALL
    SELECT 36, 8, 1 UNION ALL
    SELECT 37, 9, 3 UNION ALL
    SELECT 38, 10, 4 UNION ALL
    SELECT 39, 11, 2 UNION ALL
    SELECT 39, 12, 1 UNION ALL
    SELECT 40, 13, 1 UNION ALL
    SELECT 40, 14, 2 UNION ALL
    SELECT 41, 1, 2 UNION ALL
    SELECT 42, 3, 1 UNION ALL
    SELECT 42, 5, 2 UNION ALL
    SELECT 43, 7, 3 UNION ALL
    SELECT 44, 9, 1 UNION ALL
    SELECT 44, 10, 2 UNION ALL
    SELECT 45, 12, 3 UNION ALL
    SELECT 46, 14, 1 UNION ALL
    SELECT 47, 5, 2 UNION ALL
    SELECT 48, 6, 1 UNION ALL
    SELECT 48, 7, 2 UNION ALL
    SELECT 49, 8, 3 UNION ALL
    SELECT 50, 10, 1 UNION ALL
    SELECT 50, 11, 2
) vta
JOIN PRODUCTOS p ON vta.COD_PRODUCTO = p.COD_PRODUCTO;

-- tablas para llamar la BD: 
select * from clientes;

select * from productos;

select * from ventas;

select * from detalle_venta;

-- FIN DE LA BASE DE DATOS
-- --------------------------------------------------------