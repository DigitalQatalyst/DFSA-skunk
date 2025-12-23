SELECT organisation_id,
       created_at,
       updated_at,
       prudential_category,
       total_permissions_count,
       license_category_financial_services,
       license_category_insurance_general,
       license_category_insurance_life,
       license_category_emps,
       license_category_money_services,
       license_category_cra,
       license_category_ats,
       license_category_pcc
FROM public.profiledomain_products
LIMIT 1000;