package com.rrps.config;

import com.rrps.entity.*;
import com.rrps.enums.*;
import com.rrps.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final SKURepository skuRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReturnPolicyRepository returnPolicyRepository;
    private final RtmBatchRepository rtmBatchRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            List<User> initialUsers = Arrays.asList(
                new User(null, "Karthik", "karthik@enterprise.com", "+1 (555) 234-5678", "CUSTOMER", true),
                new User(null, "System Admin", "admin@rrms.com", "+1 (555) 019-2831", "ADMIN", true),
                new User(null, "System Admin", "admin@enterprise.com", "+1 (555) 019-2831", "ADMIN", true),
                new User(null, "Sarah Support", "support@enterprise.com", "+1 (555) 345-6789", "CUSTOMER_SUPPORT", true),
                new User(null, "Alex Warehouse Tech", "qc@enterprise.com", "+1 (555) 456-7890", "WAREHOUSE_QC", true),
                new User(null, "Sarah Accountant", "finance@enterprise.com", "+1 (555) 567-8901", "FINANCE", true),
                new User(null, "Frank Supplier Manager", "supplier@enterprise.com", "+1 (555) 678-9012", "SUPPLIER_MANAGER", true)
            );
            userRepository.saveAll(initialUsers);
            System.out.println("Initialized seed Users in DB.");
        }

        if (customerRepository.count() == 0) {
            List<Customer> initialCustomers = Arrays.asList(
                new Customer(null, "Karthik", "karthik@enterprise.com", "+1 (555) 234-5678", "406 Tech Blvd, San Francisco, CA", false),
                new Customer(null, "Jane Smith", "jane.smith@example.com", "+1 (555) 345-8899", "123 Market St, San Francisco, CA", false),
                new Customer(null, "Alice Johnson", "alice.j@example.com", "+1 (555) 456-1122", "789 Mission St, San Jose, CA", false),
                new Customer(null, "Bob Wilson", "bob.wilson@example.com", "+1 (555) 567-3344", "456 Castro St, Mountain View, CA", false),
                new Customer(null, "David Miller", "david.m@example.com", "+1 (555) 678-5566", "101 University Ave, Palo Alto, CA", false),
                new Customer(null, "Marcus Vance", "marcus.v@example.com", "+1 (555) 789-9900", "555 Pine St, Oakland, CA", true)
            );
            customerRepository.saveAll(initialCustomers);
            System.out.println("Initialized seed Customers in DB.");
        }

        if (supplierRepository.count() == 0) {
            Supplier elco = new Supplier(null, "Elco Micro Components Ltd.", "supplier@elco.com", "+1 (555) 998-1122", "Industrial Hub 4, San Jose, CA", true);
            supplierRepository.save(elco);
            System.out.println("Initialized seed Suppliers in DB.");
        }

        if (rtmBatchRepository.count() == 0) {
            Supplier elco = supplierRepository.findAll().get(0);
            RtmBatch batch1 = new RtmBatch(null, elco, "4x SKU-MON-4K (Curved Display Artifacts)", "DL12345678", new BigDecimal("36000.00"), RtmStatus.ACCUMULATED);
            RtmBatch batch2 = new RtmBatch(null, elco, "8x SKU-KEYB-BLK (PCB Malfunction)", "DL98765432", new BigDecimal("72000.00"), RtmStatus.DISPATCHED);
            rtmBatchRepository.saveAll(Arrays.asList(batch1, batch2));
            System.out.println("Initialized seed RTM Batches in DB.");
        }

        if (returnPolicyRepository.count() == 0) {
            List<ReturnPolicy> initialPolicies = Arrays.asList(
                new ReturnPolicy(null, PolicyEntityType.CATEGORY, null, 7, false, true, null, LocalDate.of(2026, 1, 1)),
                new ReturnPolicy(null, PolicyEntityType.CATEGORY, null, 30, true, true, null, LocalDate.of(2026, 1, 1)),
                new ReturnPolicy(null, PolicyEntityType.PLATFORM, null, 14, false, true, null, LocalDate.of(2026, 1, 1))
            );
            returnPolicyRepository.saveAll(initialPolicies);
            System.out.println("Initialized seed Return Policies in DB.");
        }

        if (skuRepository.count() == 0) {
            Supplier supplier = supplierRepository.findAll().get(0);
            List<SKU> initialSkus = Arrays.asList(
                new SKU(null, "SKU-KEYB-BLK", "Enterprise Wireless Keyboard", "Electronics", "Wireless keyboard with silent switches", new BigDecimal("120.00"), 50, true, supplier),
                new SKU(null, "SKU-MON-4K", "Pro 4K Ultra-Wide Monitor", "Electronics", "34-inch curved 4K monitor", new BigDecimal("699.00"), 20, true, supplier),
                new SKU(null, "SKU-HUB-USBC", "USB-C Multi-port Hub Adapter", "Accessories", "7-in-1 USB-C hub", new BigDecimal("45.00"), 100, true, supplier),
                new SKU(null, "SKU-HDPH-NC", "Noise-Canceling Over-Ear Headset", "Electronics", "ANC Bluetooth headphones", new BigDecimal("299.00"), 35, true, supplier),
                new SKU(null, "SKU-CHRG-65W", "Fast Charge 65W GaN Charger", "Accessories", "Dual port GaN wall charger", new BigDecimal("89.00"), 80, true, supplier),
                new SKU(null, "SKU-TSHIRT-M", "Premium Performance T-Shirt (M)", "Apparel", "Breathable sports tee size M", new BigDecimal("35.00"), 150, true, supplier),
                new SKU(null, "SKU-PERF-50M", "Luxury Fragrance Perfume (50ml)", "Beauty & Fragrance", "Long-lasting premium perfume", new BigDecimal("115.00"), 60, true, supplier),
                new SKU(null, "SKU-MOUSE-ERG", "Ergonomic Vertical Wireless Mouse", "Electronics", "Reduces wrist strain wireless mouse", new BigDecimal("75.00"), 90, true, supplier),
                new SKU(null, "SKU-DESK-PAD", "Leather Desk Pad Protector", "Accessories", "Waterproof desk mat 80x40cm", new BigDecimal("40.00"), 110, true, supplier),
                new SKU(null, "SKU-SPKR-BT", "Portable Waterproof Bluetooth Speaker", "Electronics", "IPX7 waterproof wireless speaker", new BigDecimal("130.00"), 45, true, supplier)
            );
            skuRepository.saveAll(initialSkus);
            System.out.println("Initialized 10 seed SKUs in DB.");
        }

        if (orderRepository.count() == 0) {
            Customer karthik = customerRepository.findAll().stream().filter(c -> c.getName().equals("Karthik")).findFirst().orElse(customerRepository.findAll().get(0));

            SKU keyb = skuRepository.findBySkuCode("SKU-KEYB-BLK").orElse(null);
            SKU mon = skuRepository.findBySkuCode("SKU-MON-4K").orElse(null);
            SKU hub = skuRepository.findBySkuCode("SKU-HUB-USBC").orElse(null);
            SKU hdph = skuRepository.findBySkuCode("SKU-HDPH-NC").orElse(null);
            SKU chrg = skuRepository.findBySkuCode("SKU-CHRG-65W").orElse(null);
            SKU shirt = skuRepository.findBySkuCode("SKU-TSHIRT-M").orElse(null);
            SKU perf = skuRepository.findBySkuCode("SKU-PERF-50M").orElse(null);
            SKU mouse = skuRepository.findBySkuCode("SKU-MOUSE-ERG").orElse(null);
            SKU pad = skuRepository.findBySkuCode("SKU-DESK-PAD").orElse(null);
            SKU spkr = skuRepository.findBySkuCode("SKU-SPKR-BT").orElse(null);

            Order o1 = new Order(null, "ORD-98721", karthik, new BigDecimal("120.00"), LocalDateTime.of(2026, 7, 2, 10, 0), LocalDateTime.of(2026, 7, 8, 14, 0), "CARD", null);
            Order o2 = new Order(null, "ORD-54320", karthik, new BigDecimal("699.00"), LocalDateTime.of(2026, 7, 5, 11, 30), LocalDateTime.of(2026, 7, 11, 16, 0), "CARD", null);
            Order o3 = new Order(null, "ORD-11209", karthik, new BigDecimal("45.00"), LocalDateTime.of(2026, 7, 6, 9, 15), LocalDateTime.of(2026, 7, 10, 13, 0), "STORE_CREDIT", null);
            Order o4 = new Order(null, "ORD-88127", karthik, new BigDecimal("299.00"), LocalDateTime.of(2026, 7, 1, 15, 45), LocalDateTime.of(2026, 7, 5, 12, 0), "COD", null);
            Order o5 = new Order(null, "ORD-77104", karthik, new BigDecimal("89.00"), LocalDateTime.of(2026, 7, 15, 12, 0), LocalDateTime.of(2026, 7, 20, 17, 0), "CARD", null);
            Order o6 = new Order(null, "ORD-63390", karthik, new BigDecimal("35.00"), LocalDateTime.of(2026, 7, 14, 14, 20), LocalDateTime.of(2026, 7, 18, 11, 0), "CARD", null);
            Order o7 = new Order(null, "ORD-44912", karthik, new BigDecimal("115.00"), LocalDateTime.of(2026, 7, 18, 10, 0), LocalDateTime.of(2026, 7, 22, 15, 0), "CARD", null);
            Order o8 = new Order(null, "ORD-33201", karthik, new BigDecimal("75.00"), LocalDateTime.of(2026, 7, 20, 16, 30), LocalDateTime.of(2026, 7, 25, 12, 0), "CARD", null);
            Order o9 = new Order(null, "ORD-22108", karthik, new BigDecimal("40.00"), LocalDateTime.of(2026, 7, 21, 11, 0), LocalDateTime.of(2026, 7, 26, 14, 30), "CARD", null);
            Order o10 = new Order(null, "ORD-11095", karthik, new BigDecimal("130.00"), LocalDateTime.of(2026, 7, 24, 13, 15), LocalDateTime.of(2026, 7, 29, 16, 0), "CARD", null);

            orderRepository.saveAll(Arrays.asList(o1, o2, o3, o4, o5, o6, o7, o8, o9, o10));

            if (keyb != null) orderItemRepository.save(new OrderItem(null, o1, keyb, 1, new BigDecimal("120.00")));
            if (mon != null) orderItemRepository.save(new OrderItem(null, o2, mon, 1, new BigDecimal("699.00")));
            if (hub != null) orderItemRepository.save(new OrderItem(null, o3, hub, 1, new BigDecimal("45.00")));
            if (hdph != null) orderItemRepository.save(new OrderItem(null, o4, hdph, 1, new BigDecimal("299.00")));
            if (chrg != null) orderItemRepository.save(new OrderItem(null, o5, chrg, 1, new BigDecimal("89.00")));
            if (shirt != null) orderItemRepository.save(new OrderItem(null, o6, shirt, 1, new BigDecimal("35.00")));
            if (perf != null) orderItemRepository.save(new OrderItem(null, o7, perf, 1, new BigDecimal("115.00")));
            if (mouse != null) orderItemRepository.save(new OrderItem(null, o8, mouse, 1, new BigDecimal("75.00")));
            if (pad != null) orderItemRepository.save(new OrderItem(null, o9, pad, 1, new BigDecimal("40.00")));
            if (spkr != null) orderItemRepository.save(new OrderItem(null, o10, spkr, 1, new BigDecimal("130.00")));

            System.out.println("Initialized 10 seed Orders and OrderItems for Karthik in DB.");
        }
    }
}
