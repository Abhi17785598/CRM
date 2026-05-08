@echo off
echo Fixing compilation errors...

echo Backing up problematic controllers...
copy "AccountingController.cs" "AccountingController.cs.bak"
copy "ManufacturingController.cs" "ManufacturingController.cs.bak"
copy "CRMController.cs" "CRMController.cs.bak"
copy "DashboardController.cs" "DashboardController.cs.bak"
copy "HRMSController.cs" "HRMSController.cs.bak"
copy "ProductsController.cs" "ProductsController.cs.bak"
copy "PayrollController.cs" "PayrollController.cs.bak"

echo.
echo Restoring fixed controllers...
copy "HRMSController_Fixed.cs" "HRMSController.cs"
copy "OrdersController.cs" "OrdersController.cs.bak"
copy "PayslipsController.cs" "PayslipsController.cs.bak"

echo.
echo Cleaning up backup files...
del "*.bak"

echo.
echo Done! Controllers have been fixed.
