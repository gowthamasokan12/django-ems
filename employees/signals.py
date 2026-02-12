from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Employee

@receiver(post_save, sender=Employee)
def send_welcome_email(sender, instance, created, **kwargs):
    """
    Send a welcome email when a new employee is created.
    """
    if created:
        subject = 'Welcome to the Team!'
        message = f"""
        Dear {instance.first_name},

        Welcome to our company! We are excited to have you on board as a {instance.role.replace('_', ' ').title()}.

        Department: {instance.department.name if instance.department else 'N/A'}

        Please contact HR for your onboarding credentials.

        Best regards,
        HR Team
        """
        
        # Send to the employee's email
        recipient_list = [instance.email]
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                recipient_list,
                fail_silently=False,
            )
            print(f"Welcome email sent to {instance.email}")
        except Exception as e:
            print(f"Failed to send welcome email to {instance.email}: {str(e)}")
