"""add users table
Revision ID: 20260428_add_users_table
Revises: 20260428_fix_mars_types
Create Date: 2026-04-28 23:15:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260428_add_users_table"
down_revision = "20260428_fix_mars_types"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    tables = inspector.get_table_names()

    if "users" not in tables:
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
            sa.Column("email", sa.String(length=255), nullable=False),
            sa.Column("full_name", sa.String(length=120), nullable=False),
            sa.Column("hashed_password", sa.String(length=255), nullable=False),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        )

    indexes = {idx["name"] for idx in inspector.get_indexes("users")}
    if "ix_users_id" not in indexes:
        op.create_index("ix_users_id", "users", ["id"], unique=False)
    if "ix_users_email" not in indexes:
        op.create_index("ix_users_email", "users", ["email"], unique=True)


def downgrade():
    op.drop_index("ix_users_email", table_name="users")
    op.drop_index("ix_users_id", table_name="users")
    op.drop_table("users")
