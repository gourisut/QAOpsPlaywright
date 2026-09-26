Feature: Ecoomerce Validations

    Scenario: Placing the order
        Given a login to Ecommerce application with "anshika@gmail.com" and "Iamking@000"
        When Add "ZARA COAT 3" to cart
        Then Verify "ZARA COAT 3" is displayed in cart
        When Enter Valid details and place the order
        Then Verify order is present in OrderHistory page
