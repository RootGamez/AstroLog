"""add owner_id to records and favorites
Revision ID: 20260428_add_owner_id
Revises: 20260428_add_users_table
Create Date: 2026-04-28 23:55:00.000000
"""

from alembic import op
import sqlalchemy as sa


revision = "20260428_add_owner_id"
down_revision = "20260428_add_users_table"
branch_labels = None
depends_on = None


def _ensure_legacy_user(bind) -> int:
    legacy_id = bind.execute(
        sa.text("SELECT id FROM users WHERE email = :email LIMIT 1"),
        {"email": "legacy@local"},
    ).scalar()

    if legacy_id is None:
        bind.execute(
            sa.text(
                """
                INSERT INTO users (email, full_name, hashed_password, is_active)
                VALUES (:email, :full_name, :hashed_password, true)
                """
            ),
            {
                "email": "legacy@local",
                "full_name": "Legacy Data",
                "hashed_password": "legacy-no-login",
            },
        )
        legacy_id = bind.execute(
            sa.text("SELECT id FROM users WHERE email = :email LIMIT 1"),
            {"email": "legacy@local"},
        ).scalar()

    return int(legacy_id)


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    records_cols = {col["name"] for col in inspector.get_columns("astrolog_records")}
    mars_cols = {col["name"] for col in inspector.get_columns("mars_explorations")}

    if "owner_id" not in records_cols:
        op.add_column("astrolog_records", sa.Column("owner_id", sa.Integer(), nullable=True))
    if "owner_id" not in mars_cols:
        op.add_column("mars_explorations", sa.Column("owner_id", sa.Integer(), nullable=True))

    legacy_user_id = _ensure_legacy_user(bind)

    bind.execute(
        sa.text("UPDATE astrolog_records SET owner_id = :owner_id WHERE owner_id IS NULL"),
        {"owner_id": legacy_user_id},
    )
    bind.execute(
        sa.text("UPDATE mars_explorations SET owner_id = :owner_id WHERE owner_id IS NULL"),
        {"owner_id": legacy_user_id},
    )

    op.alter_column("astrolog_records", "owner_id", nullable=False)
    op.alter_column("mars_explorations", "owner_id", nullable=False)

    records_fks = {fk.get("name") for fk in inspector.get_foreign_keys("astrolog_records")}
    mars_fks = {fk.get("name") for fk in inspector.get_foreign_keys("mars_explorations")}

    if "fk_astrolog_records_owner_id_users" not in records_fks:
        op.create_foreign_key(
            "fk_astrolog_records_owner_id_users",
            "astrolog_records",
            "users",
            ["owner_id"],
            ["id"],
        )
    if "fk_mars_explorations_owner_id_users" not in mars_fks:
        op.create_foreign_key(
            "fk_mars_explorations_owner_id_users",
            "mars_explorations",
            "users",
            ["owner_id"],
            ["id"],
        )

    records_indexes = {idx["name"] for idx in inspector.get_indexes("astrolog_records")}
    mars_indexes = {idx["name"] for idx in inspector.get_indexes("mars_explorations")}

    if "ix_astrolog_records_owner_id" not in records_indexes:
        op.create_index("ix_astrolog_records_owner_id", "astrolog_records", ["owner_id"], unique=False)
    if "ix_mars_explorations_owner_id" not in mars_indexes:
        op.create_index("ix_mars_explorations_owner_id", "mars_explorations", ["owner_id"], unique=False)


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    records_indexes = {idx["name"] for idx in inspector.get_indexes("astrolog_records")}
    mars_indexes = {idx["name"] for idx in inspector.get_indexes("mars_explorations")}
    if "ix_astrolog_records_owner_id" in records_indexes:
        op.drop_index("ix_astrolog_records_owner_id", table_name="astrolog_records")
    if "ix_mars_explorations_owner_id" in mars_indexes:
        op.drop_index("ix_mars_explorations_owner_id", table_name="mars_explorations")

    records_fks = {fk.get("name") for fk in inspector.get_foreign_keys("astrolog_records")}
    mars_fks = {fk.get("name") for fk in inspector.get_foreign_keys("mars_explorations")}
    if "fk_astrolog_records_owner_id_users" in records_fks:
        op.drop_constraint("fk_astrolog_records_owner_id_users", "astrolog_records", type_="foreignkey")
    if "fk_mars_explorations_owner_id_users" in mars_fks:
        op.drop_constraint("fk_mars_explorations_owner_id_users", "mars_explorations", type_="foreignkey")

    records_cols = {col["name"] for col in inspector.get_columns("astrolog_records")}
    mars_cols = {col["name"] for col in inspector.get_columns("mars_explorations")}
    if "owner_id" in records_cols:
        op.drop_column("astrolog_records", "owner_id")
    if "owner_id" in mars_cols:
        op.drop_column("mars_explorations", "owner_id")
