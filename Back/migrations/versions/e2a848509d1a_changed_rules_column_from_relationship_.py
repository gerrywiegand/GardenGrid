"""changed rules column from relationship to interaction

Revision ID: e2a848509d1a
Revises: 2e950757f248
Create Date: 2026-xx-xx xx:xx:xx.xxxxxx
"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "e2a848509d1a"
down_revision = "2e950757f248"
branch_labels = None
depends_on = None


def upgrade():
    # NOTE:
    # This migration ONLY swaps the column name/meaning.
    # Do NOT recreate/drop foreign keys in SQLite batch mode unless you give them explicit names.

    with op.batch_alter_table("companion_rules", schema=None) as batch_op:
        # Add the new column.
        # server_default is here so existing rows (if any) don't violate NOT NULL during the table copy.
        batch_op.add_column(
            sa.Column(
                "interaction",
                sa.String(length=50),
                nullable=False,
                server_default="neutral",
            )
        )

        # If you want to attempt to preserve old data, uncomment this:
        # op.execute("UPDATE companion_rules SET interaction = relationship")

        # Drop the old column
        batch_op.drop_column("relationship")

        # Remove default going forward (optional, but nice)
        batch_op.alter_column("interaction", server_default=None)


def downgrade():
    with op.batch_alter_table("companion_rules", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                "relationship",
                sa.String(length=50),
                nullable=False,
                server_default="neutral",
            )
        )

        # If you preserved data on upgrade and want to reverse it, uncomment:
        # op.execute("UPDATE companion_rules SET relationship = interaction")

        batch_op.drop_column("interaction")
        batch_op.alter_column("relationship", server_default=None)
